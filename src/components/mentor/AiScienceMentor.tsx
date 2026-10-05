import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Send, Sparkles, HelpCircle, Volume2, Mic, MicOff, Globe,
  ExternalLink, RotateCcw, CheckCircle2, ChevronRight, Zap, BookOpen, VolumeX
} from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface GroundingSource {
  title: string;
  uri: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  p6Tip?: string;
  sources?: GroundingSource[];
  modelUsed?: string;
  isAudioPlaying?: boolean;
}

const PRESET_QUESTIONS = [
  '[Cambridge 6Bp.01 · My Pals 6B] Why do plants wilt when watered with salty water?',
  '[Cambridge 6Pf.01 · My Pals 6A] Why do roller coasters not need engines after the first hill?',
  '[Cambridge 6Pe.01 · My Pals Systems] Why are household lights wired in parallel instead of series?',
  '[Cambridge 6Es.01 · My Pals Cycles] Why does the Moon appear to change shape over 29.5 days?',
  '[Cambridge 6Be.03 · My Pals 6A] Why do desert animals have large ears with many blood vessels?',
  '[Cambridge 6Bs.02 · My Pals Systems] What is the difference between breathing and cellular respiration?',
  '[Cambridge 6Bp.02 · My Pals 6B] What causes the stem swelling in a tree ring experiment?'
];

const CURATED_KNOWLEDGE: Record<string, { answer: string; tip: string }> = {
  salty_water: {
    answer: "When you water a plant with concentrated salty water, the salt water has a lower water potential than the cell sap inside the plant's root hair cells!\n\nThrough the process of **osmosis**, water moves down the water potential gradient—leaving the plant cells into the salty soil. As plant cells lose water, their vacuoles shrink and they lose **turgor pressure** (becoming flaccid and plasmolysed). Without turgidity, the plant loses mechanical support and wilts.",
    tip: "P6 Exam Tip: Always state that water moves from an area of higher water potential (inside root cell) to lower water potential (salty soil) by osmosis."
  },
  roller_coaster: {
    answer: "At the top of the initial lift hill, motors elevate the coaster cart to give it a maximum reservoir of **Gravitational Potential Energy (GPE)**.\n\nOnce released, gravity pulls the cart downward, converting that stored GPE into **Kinetic Energy (KE)** (speed)! As long as every subsequent hill and loop is lower than the first hill, the cart retains sufficient kinetic energy to climb them. By the **Law of Conservation of Energy**, energy is conserved—it simply oscillates between GPE and KE!",
    tip: "P6 Exam Tip: Each subsequent hill must be lower than the initial hill because some mechanical energy is inevitably converted into thermal energy (heat) and sound energy due to track friction and air resistance."
  },
  moon_phases: {
    answer: "The Moon appears to change shape because it is **non-luminous** and reflects sunlight! Exactly 50% of the Moon's spherical surface is always illuminated by the Sun at all times.\n\nAs the Moon revolves around Earth once every **29.5-day synodic month**, our observation angle from Earth continuously changes. Consequently, we see different fractions of that illuminated hemisphere (from New Moon, Crescent, Quarter, Gibbous, to Full Moon).",
    tip: "Cambridge & My Pals Exam Warning: Normal moon phases are NEVER caused by Earth's shadow! Earth's shadow only causes Lunar Eclipses."
  },
  household_parallel: {
    answer: "Household appliances and lighting are wired in **parallel circuits** for two essential reasons:\n\n1. **Independent Control & Continuity**: Each branch forms its own independent closed loop with the electrical mains. If one light bulb filament fuses or is switched off, the other branches remain complete and functional!\n2. **Constant Voltage & Brightness**: Every branch receives the full mains potential difference (voltage), so adding more bulbs does not diminish the brightness of existing bulbs.",
    tip: "P6 Exam Tip: In a series circuit, if one bulb blows, the entire single loop is broken and all appliances shut off."
  },
  desert_ears: {
    answer: "Desert species like the Fennec Fox and Black-tailed Jackrabbit possess oversized, thin ears heavily vascularized with blood capillaries.\n\nThis is a **structural adaptation**: when resting in shade or cool evening air, warm core blood is pumped through the ear vessels. Because the large ear surface provides a high surface-area-to-volume ratio, body heat rapidly radiates away into the atmosphere without sweating, conserving vital water.",
    tip: "P6 Exam Tip: Identify this as a structural adaptation designed to maximize heat loss via thermal radiation."
  },
  breathing_respiration: {
    answer: "Be careful not to confuse these two distinct biological processes!\n\n• **Breathing (Ventilation)**: A physical, mechanical process involving the diaphragm and ribcage to move air into and out of the lungs for gaseous exchange across alveoli.\n• **Cellular Respiration**: A biochemical reaction occurring in the mitochondria of every living cell, where glucose reacts with oxygen to release usable energy (ATP), carbon dioxide, and water vapor.",
    tip: "P6 Exam Tip: Breathing happens exclusively in the respiratory system, whereas cellular respiration happens inside every living cell in the body."
  }
};

export const AiScienceMentor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'mentor',
      text: "Hello, young scientist! I'm Dr. Atom, your AI Science Mentor at Bina Bangsa School. Ask me any concept you find challenging—such as energy conversions, plant transport, lunar phases, or electrical circuits!",
      timestamp: 'Just now',
      p6Tip: 'Tap any trending question below or click the microphone to speak your question!'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [modelChoice, setModelChoice] = useState<'standard' | 'fast' | 'complex'>('standard');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Audio Playback Cleanup
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, [currentAudio]);

  // Text-to-Speech via Server API
  const handlePlayTTS = async (messageId: string, text: string) => {
    if (playingAudioId === messageId) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      setPlayingAudioId(null);
      return;
    }

    try {
      soundEffects.playClick();
      setPlayingAudioId(messageId);

      const res = await fetch('/api/mentor/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Puck' })
      });

      if (!res.ok) {
        throw new Error('TTS service unavailable');
      }

      const data = await res.json();
      if (data.audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);

        audio.onended = () => {
          setPlayingAudioId(null);
          setCurrentAudio(null);
        };

        audio.play();
      }
    } catch {
      // Fallback: browser speech synthesis if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 250));
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.onend = () => setPlayingAudioId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPlayingAudioId(null);
      }
    }
  };

  // Voice recording & transcription using gemini-3.5-transcribe
  const handleToggleRecord = async () => {
    if (isRecording) {
      // Stop recording
      soundEffects.playClick();
      setIsRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } else {
      // Start recording
      try {
        soundEffects.playScannerBeep();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());

          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (base64Data) {
              setIsThinking(true);
              try {
                const res = await fetch('/api/mentor/transcribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ audioBase64: base64Data, mimeType: 'audio/webm' })
                });
                const data = await res.json();
                if (data.transcript && data.transcript.trim()) {
                  setInputVal(data.transcript);
                  handleSendQuestion(data.transcript);
                } else {
                  setIsThinking(false);
                }
              } catch {
                setIsThinking(false);
              }
            }
          };
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone access failed:', err);
      }
    }
  };

  // Send question
  const handleSendQuestion = async (queryText: string) => {
    if (!queryText.trim() || isThinking) return;
    soundEffects.playClick();

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: queryText,
      timestamp: 'Just now'
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputVal('');
    setIsThinking(true);

    try {
      // Call Gemini Server Endpoint
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text
          })),
          useSearchGrounding,
          modelChoice
        })
      });

      if (!response.ok) {
        throw new Error('Server returned non-200');
      }

      const data = await response.json();
      soundEffects.playBubble();

      if (data.text) {
        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'mentor',
            text: data.text,
            timestamp: 'Just now',
            sources: data.groundingSources && data.groundingSources.length > 0 ? data.groundingSources : undefined,
            modelUsed: data.modelUsed
          }
        ]);
        setIsThinking(false);
        return;
      }
    } catch {
      // Graceful offline fallback
    }

    // Fallback: Smart local knowledge matching
    const lower = queryText.toLowerCase();
    let replyText = '';
    let p6Tip = '';

    if (lower.includes('salt') || lower.includes('wilt') || lower.includes('celery') || lower.includes('osmosis')) {
      replyText = CURATED_KNOWLEDGE.salty_water.answer;
      p6Tip = CURATED_KNOWLEDGE.salty_water.tip;
    } else if (lower.includes('coaster') || lower.includes('hill') || lower.includes('energy') || lower.includes('kinetic') || lower.includes('potential')) {
      replyText = CURATED_KNOWLEDGE.roller_coaster.answer;
      p6Tip = CURATED_KNOWLEDGE.roller_coaster.tip;
    } else if (lower.includes('moon') || lower.includes('phase') || lower.includes('eclipse') || lower.includes('synodic') || lower.includes('cycle')) {
      replyText = CURATED_KNOWLEDGE.moon_phases.answer;
      p6Tip = CURATED_KNOWLEDGE.moon_phases.tip;
    } else if (lower.includes('parallel') || lower.includes('series') || lower.includes('house') || lower.includes('circuit') || lower.includes('fuse')) {
      replyText = CURATED_KNOWLEDGE.household_parallel.answer;
      p6Tip = CURATED_KNOWLEDGE.household_parallel.tip;
    } else if (lower.includes('ear') || lower.includes('fox') || lower.includes('desert') || lower.includes('adaptation')) {
      replyText = CURATED_KNOWLEDGE.desert_ears.answer;
      p6Tip = CURATED_KNOWLEDGE.desert_ears.tip;
    } else if (lower.includes('breath') || lower.includes('respirat')) {
      replyText = CURATED_KNOWLEDGE.breathing_respiration.answer;
      p6Tip = CURATED_KNOWLEDGE.breathing_respiration.tip;
    } else {
      replyText = `That is an excellent inquiry regarding "${queryText}"!\n\nIn Cambridge Stage 6 and My Pals P6 examinations, structure your open-ended explanation following the **C-E-O Framework**:\n1. **Cause**: Identify the scientific principle or force.\n2. **Effect**: Detail what happens dynamically in the system.\n3. **Observation**: State the tangible experimental measurement or visual result.`;
      p6Tip = "P6 Exam Tip: Always anchor your response to scientific vocabulary rather than conversational descriptions.";
    }

    setTimeout(() => {
      soundEffects.playBubble();
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'mentor',
          text: replyText,
          timestamp: 'Just now',
          p6Tip
        }
      ]);
    }, 400);
  };

  const handleResetChat = () => {
    soundEffects.playClick();
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setPlayingAudioId(null);
    setMessages([
      {
        id: 'm1',
        sender: 'mentor',
        text: "Chat cleared! What science topic would you like to explore next? Feel free to ask about energy, lunar phases, plant transport, forces, or circuits!",
        timestamp: 'Just now',
        p6Tip: 'Tip: You can enable Google Search Grounding above to integrate up-to-date science discoveries.'
      }
    ]);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 overflow-hidden shadow-xs flex flex-col h-[700px] transition-all">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-indigo-100/70 bg-gradient-to-r from-indigo-50/70 via-sky-50/50 to-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-indigo-950 tracking-tight">
                Dr. Atom · AI Science Mentor
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Cambridge & My Pals P6
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive explanations, C-E-O answer structuring, and search grounding.
            </p>
          </div>
        </div>

        {/* Feature Controls */}
        <div className="flex items-center gap-2">
          {/* Search Grounding Toggle */}
          <button
            onClick={() => {
              soundEffects.playClick();
              setUseSearchGrounding(!useSearchGrounding);
            }}
            title="Ground answers with verified real-time Google Search data"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              useSearchGrounding
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-blue-700 border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Search Grounding {useSearchGrounding ? 'ON' : 'OFF'}</span>
          </button>

          {/* Model Selector */}
          <select
            value={modelChoice}
            onChange={e => setModelChoice(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="standard">Gemini 3.5 Flash</option>
            <option value="fast">Flash Lite (Fast)</option>
            <option value="complex">Gemini 3.1 Pro</option>
          </select>

          {/* Reset Chat */}
          <button
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] sm:max-w-[78%] p-4 rounded-2xl text-xs leading-relaxed space-y-2.5 shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs'
                  : 'bg-white border border-indigo-100/90 text-slate-800 rounded-bl-xs'
              }`}
            >
              <div className="whitespace-pre-line font-medium text-[13px] leading-relaxed">
                {msg.text}
              </div>

              {/* Examiner Tip Badge */}
              {msg.p6Tip && (
                <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="font-medium">{msg.p6Tip}</div>
                </div>
              )}

              {/* Grounding Sources (Search Grounding) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-500" />
                    Verified Google Search References:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((s, sIdx) => (
                      <a
                        key={sIdx}
                        href={s.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-medium transition-colors"
                      >
                        <span className="truncate max-w-[180px]">{s.title || s.uri}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Read Aloud TTS Button for Mentor messages */}
              {msg.sender === 'mentor' && (
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayTTS(msg.id, msg.text)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors font-semibold ${
                        playingAudioId === msg.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {playingAudioId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Read Aloud</span>
                        </>
                      )}
                    </button>
                    {msg.modelUsed && (
                      <span className="text-[10px] text-slate-400">
                        via {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5 text-xs text-indigo-900 bg-white px-4 py-3 rounded-2xl border border-indigo-100 w-fit shadow-2xs">
            <Bot className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="font-semibold">Dr. Atom is analyzing with Gemini AI & P6 framework...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Questions Bar */}
      <div className="px-4 py-2.5 border-t border-indigo-50 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-slate-400 whitespace-nowrap text-[11px] font-semibold flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Syllabus Prompts:
        </span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuestion(q)}
            className="px-3 py-1 rounded-xl bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-900 text-slate-700 whitespace-nowrap transition-colors text-[11px] font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input & Voice Controls */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendQuestion(inputVal);
        }}
        className="p-3 sm:p-4 border-t border-indigo-100 bg-white flex items-center gap-2"
      >
        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleToggleRecord}
          title={isRecording ? 'Stop listening' : 'Voice input (Gemini audio transcribe)'}
          className={`p-2.5 rounded-2xl border transition-all ${
            isRecording
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border-slate-200'
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          placeholder={isRecording ? 'Listening to your voice...' : "Ask Dr. Atom anything (e.g. 'Why does the Moon have craters?' or 'How do fuses protect circuits?')..."}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl border border-indigo-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50/50"
        />

        <button
          type="submit"
          disabled={!inputVal.trim() || isThinking}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
