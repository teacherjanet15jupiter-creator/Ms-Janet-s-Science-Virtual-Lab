import React, { useState } from 'react';
import { BookOpen, Award, Sparkles, ChevronDown, ChevronUp, ExternalLink, HelpCircle, CheckCircle2 } from 'lucide-react';
import { CURRICULUM_MODULES } from '../../data/curriculumData';
import { ScienceTopic } from '../../types/science';
import { soundEffects } from '../../utils/sound';

interface Props {
  topic: ScienceTopic;
  onOpenSyllabusMap?: () => void;
  className?: string;
}

export const CurriculumBadgeBar: React.FC<Props> = ({ topic, onOpenSyllabusMap, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const moduleData = CURRICULUM_MODULES.find(m => m.topic === topic) || CURRICULUM_MODULES[0];

  return (
    <div className={`rounded-2xl border border-indigo-100/90 bg-gradient-to-r from-amber-50/70 via-sky-50/60 to-indigo-50/70 p-3 shadow-2xs backdrop-blur-xs transition-all ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left side: Dual Syllabus Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cambridge Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 border border-sky-200 text-sky-950 text-xs font-bold shadow-2xs">
            <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="font-semibold text-sky-900">Cambridge Stage 6:</span>
            <span className="font-mono text-[11px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-bold">
              {moduleData.cambridgeCode}
            </span>
          </div>

          {/* My Pals Science Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/95 border border-amber-200 text-amber-950 text-xs font-bold shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold text-amber-900">My Pals Science P6:</span>
            <span className="text-[11px] text-amber-800 font-medium">
              {moduleData.myPalsTheme} · {moduleData.myPalsBook}
            </span>
          </div>

          {/* TWS Badge (hidden on mobile, visible on tablet+) */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
            <span>TWS Scientific Enquiry</span>
          </div>
        </div>

        {/* Right side: Expand button & Link */}
        <div className="flex items-center gap-2">
          {onOpenSyllabusMap && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenSyllabusMap();
              }}
              className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/80 transition-colors"
            >
              <span>Full Syllabus Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          <button
            onClick={() => {
              soundEffects.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-indigo-900 px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/80 hover:bg-white transition-all"
          >
            <span>{isExpanded ? 'Hide Lesson Info' : 'Lesson Details'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded Lesson Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-indigo-100/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs animate-in fade-in duration-200">
          {/* Cambridge details */}
          <div className="p-3 bg-white/90 rounded-xl border border-sky-100 space-y-1.5">
            <div className="font-bold text-sky-900 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>Cambridge Primary Science (Stage 6)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Objective:</strong> {moduleData.cambridgeObjective}
            </p>
            <p className="text-[10px] font-mono text-sky-800 bg-sky-50 p-1.5 rounded border border-sky-100">
              🧪 <strong>TWS Focus:</strong> {moduleData.cambridgeTws}
            </p>
          </div>

          {/* My Pals details */}
          <div className="p-3 bg-white/90 rounded-xl border border-amber-100 space-y-1.5">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>My Pals Are Here! Science (Marshall Cavendish)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>Chapter:</strong> {moduleData.myPalsUnit} ({moduleData.myPalsPages})
            </p>
            <p className="text-[11px] text-slate-600">
              <strong>Workbook Activity:</strong> {moduleData.myPalsWorkbookActivity}
            </p>
            <p className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-100 font-medium">
              💡 <strong>Key Inquiry Question:</strong> "{moduleData.keyInquiryQuestion}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
