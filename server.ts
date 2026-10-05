import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Multi-turn chat with Dr. Atom with optional Google Search Grounding
app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { messages, useSearchGrounding, modelChoice } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in environment.',
        useFallback: true,
      });
    }

    const selectedModel =
      modelChoice === 'fast'
        ? 'gemini-3.1-flash-lite'
        : modelChoice === 'complex'
        ? 'gemini-3.1-pro-preview'
        : 'gemini-3.5-flash';

    const systemInstruction = `You are Dr. Atom, the distinguished, cheerful, and encouraging Primary 6 Science Mentor at Bina Bangsa School.
You specialize in preparing students for the Cambridge Primary Checkpoint (Stage 6) and Singapore's "My Pals Are Here! Science" (P6) curriculum.

Pedagogical Core Principles:
1. Always be enthusiastic, encouraging, and pedagogically clear. Address the student as an aspiring young scientist.
2. Structure open-ended science answers using the C-E-O strategy:
   - Cause: Identify the underlying scientific principle, force, or biological process.
   - Effect: Explain what happens mechanically or chemically inside the setup or organism.
   - Observation: State the clear, observable, or measurable experimental outcome.
3. Conclude with an explicit "P6 Exam Tip" or "Cambridge Examiner Warning" that directly targets common student pitfalls or traps.
4. Bold essential keywords (e.g. **conservation of energy**, **xylem vessels**, **transpiration pull**, **parallel circuit**, **synchronous rotation**, **eutrophication**).
5. When Google Search grounding is enabled or when answering current science questions (e.g., current space missions, clean energy, James Webb telescope findings), incorporate accurate real-world facts with scientific wonder.`;

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'mentor' || m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (contents.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const tools = useSearchGrounding ? [{ googleSearch: {} }] : undefined;

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        tools,
      },
    });

    const replyText = response.text || '';

    // Extract grounding sources if any
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = (groundingChunks || [])
      .map((c: any) => c.web)
      .filter((w: any) => Boolean(w && w.uri))
      .map((w: any) => ({
        title: w.title || w.uri,
        uri: w.uri,
      }));

    return res.json({
      text: replyText,
      groundingSources: sources,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate response',
      useFallback: true,
    });
  }
});

// Audio transcription endpoint using gemini-3.5-transcribe
app.post('/api/mentor/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'audio/webm',
              data: audioBase64,
            },
          },
          {
            text: "Transcribe this student's spoken science question word for word into English. Return ONLY the transcribed text.",
          },
        ],
      },
    });

    return res.json({ transcript: response.text?.trim() || '' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: error.message || 'Failed to transcribe audio' });
  }
});

// Text-to-speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/mentor/speech', async (req, res) => {
  try {
    const { text, voiceName = 'Puck' } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 350);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Cheerful, articulate, warm science teacher',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated' });
    }

    return res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({ error: error.message || 'Failed to synthesize speech' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SciQuest P6 server listening on port ${port}`);
  });
}

startServer();
