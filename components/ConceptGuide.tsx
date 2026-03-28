import React from 'react';
import { Moon, Sun, RefreshCw, Zap } from 'lucide-react';

const ConceptGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-slate-300">
      <h1 className="text-4xl font-serif text-white mb-8 border-b border-[rgba(255,255,255,0.08)] pb-4">MindGallery Concept Guide</h1>
      
      {/* NEW SECTION: How to use Polarity */}
      <section className="mb-12 bg-[#090909]/60 backdrop-blur-2xl p-8 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3">
          <Zap className="text-[#ff462e]" />
          The Polarity Framework: How to Use
        </h2>
        <div className="space-y-6">
          <p className="text-slate-300 leading-relaxed text-lg">
            This tool is an <strong>Permission Slip</strong>. It is designed to help you shift your frequency from a state of limitation to a state of expansion.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111]/80 backdrop-blur-md p-6 rounded-xl border border-[rgba(255,255,255,0.05)] relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Moon size={100} />
              </div>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="p-2 bg-indigo-950/30 rounded-full text-indigo-400 border border-indigo-500/20">
                  <Moon size={20} />
                </div>
                <h3 className="font-bold text-lg text-indigo-200">1. Identify the Definition</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 relative z-10">
                Use the <strong>Shadow Mode</strong> (Moon icon) to find the belief that resonates with your current feeling.
              </p>
              <ul className="text-sm text-slate-400 list-disc pl-4 space-y-2 relative z-10">
                <li>"I am not enough"</li>
                <li>"Money is evil"</li>
                <li>"I am alone"</li>
              </ul>
              <div className="mt-4 text-xs uppercase tracking-widest text-indigo-400 font-bold relative z-10">Step 1: Acknowledge it exists.</div>
            </div>

            <div className="bg-[#111111]/80 backdrop-blur-md p-6 rounded-xl border border-[rgba(255,255,255,0.05)] relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sun size={100} />
              </div>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="p-2 bg-yellow-900/30 rounded-full text-yellow-400 border border-yellow-500/20">
                  <Sun size={20} />
                </div>
                <h3 className="font-bold text-lg text-yellow-200">2. Replace the Definition</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4 relative z-10">
                Click the <strong>Sun icon</strong> or the card itself to flip it. This reveals the <strong>Expansive Thought</strong>.
              </p>
              <ul className="text-sm text-slate-400 list-disc pl-4 space-y-2 relative z-10">
                <li>"I am complete exactly as I am"</li>
                <li>"Money is a tool for good"</li>
                <li>"I am connected to the whole"</li>
              </ul>
              <div className="mt-4 text-xs uppercase tracking-widest text-yellow-400 font-bold relative z-10">Step 2: Choose the new preference.</div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#090909] to-[#111111] rounded-xl border-l-[3px] border-[#ff462e] shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,70,46,0.05)_0%,transparent_60%)] pointer-events-none" />
             <div className="flex items-start gap-4 relative z-10">
               <RefreshCw className="shrink-0 mt-1 text-[#ff462e]" size={24} />
               <div>
                 <h4 className="font-bold text-white text-lg mb-2">3. Lock it in (The Anchor)</h4>
                 <p className="text-slate-300 mb-4">
                   Once you have chosen the new definition, you must <strong>act as if</strong> it is true. To help with this:
                 </p>
                 <ol className="list-decimal pl-5 space-y-2 text-slate-400 text-sm">
                   <li>Open the <strong>Studio</strong> by clicking the card.</li>
                   <li>Customize the visual to match your vibration (Fonts, Colors, AI Art).</li>
                   <li><strong>Download</strong> the image.</li>
                   <li>Set it as your <strong>Phone Wallpaper</strong>.</li>
                 </ol>
                 <p className="mt-4 text-xs text-slate-500 italic">
                   Every time you look at your phone, you are reminded of your new definition. This reinforces the neural pathway until it becomes your natural state.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConceptGuide;