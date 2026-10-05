import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Upload, Play, Award, Bot, Heart, Compass, CheckCircle2, Star, Zap, BookOpen, Scan } from 'lucide-react';
import { BinaBangsaLogo } from './BinaBangsaLogo';
import { soundEffects } from '../../utils/sound';

interface Props {
  onGoToLabs: () => void;
  onGoToQuiz: () => void;
  onGoToMentor: () => void;
  onGoToSyllabus?: () => void;
  onGoToAr?: () => void;
}

export const LabHeroBanner: React.FC<Props> = ({ onGoToLabs, onGoToQuiz, onGoToMentor, onGoToSyllabus, onGoToAr }) => {
  const [cartoonImg, setCartoonImg] = useState<string | null>(() => {
    return localStorage.getItem('sciquest_lab_cartoon_img') || 'Image 05-10-26 at 15.04.png';
  });
  const [imgLoadFailed, setImgLoadFailed] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCartoonImg(result);
        localStorage.setItem('sciquest_lab_cartoon_img', result);
        setImgLoadFailed(false);
        soundEffects.playFanfare();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50/90 via-rose-50/80 to-indigo-50/90 rounded-3xl p-6 sm:p-8 border border-indigo-100/90 shadow-sm relative overflow-hidden backdrop-blur-xs">
      {/* Decorative Pastel Background Gradients */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br from-rose-200/50 via-pink-200/30 to-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-gradient-to-tr from-sky-200/50 via-teal-200/40 to-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Welcome Text & Interactive CTAs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <BinaBangsaLogo variant="crest" size="sm" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-teal-200/80 text-teal-950 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-teal-500" />
              <span>Bina Bangsa School · 培民学校</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100/90 border border-sky-300/80 text-sky-950 text-[11px] font-bold shadow-2xs">
              <Award className="w-3 h-3 text-sky-600" />
              <span>Cambridge Stage 6</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-950 text-[11px] font-bold shadow-2xs">
              <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
              <span>My Pals Science P6</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-950 tracking-tight font-serif-display leading-tight">
            Explore, Experiment & Excel with Ms. Janet & Dr. Atom!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            Welcome, Primary 6 scientists! Connected with your <strong>Cambridge Primary Science (Stage 6)</strong> lessons and <strong>My Pals Are Here! Science P6</strong> textbook chapters. Test energy conversions, trace xylem water uptake, balance forest food webs, and wire circuits.
          </p>

          {/* Ms. Janet's Daily Science Mission Callout */}
          <div className="p-3.5 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <span className="text-base">👩‍🏫</span>
                <span>Ms. Janet's Lesson of the Day (My Pals 6B / Cambridge 6Bp.01):</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                +50 Bonus XP
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              "Launch the <strong>Plant Transport Lab</strong>, test the <em>Red Eosin dye</em>, and observe how high wind speeds accelerate the photometer bubble rate!"
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={() => {
                soundEffects.playClick();
                onGoToLabs();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Virtual Labs</span>
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                onGoToQuiz();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 font-bold text-xs shadow-2xs transition-all active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-rose-600" />
              <span>Play Quiz Arena</span>
            </button>

            {onGoToSyllabus && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onGoToSyllabus();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-900 border border-sky-200 font-bold text-xs shadow-2xs transition-all active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                <span>Syllabus Map</span>
              </button>
            )}

            {onGoToAr && (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onGoToAr();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Launch AR Lab</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEffects.playClick();
                onGoToMentor();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs shadow-2xs transition-all active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <span>Ask Dr. Atom</span>
            </button>
          </div>
        </div>

        {/* Right Column: Featured Cartoon Squad Showcase Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden border-4 border-white shadow-md bg-white group">
            {/* The Image Container */}
            <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-br from-amber-100 via-rose-100 to-indigo-100 flex items-center justify-center">
              {cartoonImg && !imgLoadFailed ? (
                <img
                  src={cartoonImg}
                  alt="Ms. Janet, Dr. Atom, P6 Students and Newton the Cat"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={() => setImgLoadFailed(true)}
                />
              ) : (
                /* High-fidelity stylized cartoon character stage */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-tr from-amber-100/80 via-rose-100/70 to-indigo-100">
                  <div className="flex items-center justify-center gap-3 text-5xl drop-shadow-sm">
                    <span title="Ms. Janet - Science Teacher">👩‍🏫</span>
                    <span title="Dr. Atom - Science Mentor">👨‍🔬</span>
                    <span title="Student Investigator">👧🏻</span>
                    <span title="Student Investigator">👦🏻</span>
                    <span title="Newton the Cat">🐱</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-extrabold text-indigo-950 font-serif-display">
                      Ms. Janet's Primary 6 Science Squad
                    </div>
                    <div className="text-xs text-indigo-800 font-medium">
                      Bina Bangsa School · Laboratory Team
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Squad Tag */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-indigo-950 shadow-xs border border-white/80 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Ms. Janet's Lab Squad</span>
              </div>
            </div>

            {/* Bottom Caption Bar with Customizer */}
            <div className="p-3.5 bg-white flex items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-left">
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <span>Class of Primary 6</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-500">
                  Teacher Janet · Dr. Atom · Newton the Cat
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => {
                  soundEffects.playClick();
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold border border-indigo-200 transition-colors shrink-0"
                title="Upload or change cartoon lab team image"
              >
                <Upload className="w-3 h-3" />
                <span>Change Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
