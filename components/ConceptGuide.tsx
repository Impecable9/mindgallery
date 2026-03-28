import React from 'react';
import { Moon, Sun, RefreshCw, Zap } from 'lucide-react';

const ConceptGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 relative overflow-hidden">
      {/* Decorative Brand Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff462e]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ff462e]/3 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight tracking-tight">
          MindGallery <span className="text-[#ff462e]">Concept Guide</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Master the art of neural rewiring through visual anchors and conscious choice.
        </p>
      </div>
      
      <section className="mb-16">
        <div className="bg-gradient-to-br from-[#111111]/80 to-[#050505]/95 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] border border-[rgba(255,255,255,0.08)] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          
          <h2 className="text-3xl font-serif text-white mb-8 flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#ff462e]/10 flex items-center justify-center border border-[#ff462e]/20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="text-[#ff462e]" size={24} />
            </div>
            The Polarity Framework
          </h2>
          
          <div className="space-y-10 relative z-10">
            <p className="text-slate-300 leading-relaxed text-xl font-medium max-w-3xl">
              This tool is a <span className="text-[#ff462e] italic">Permission Slip</span>. It is designed to help you shift your frequency from a state of limitation to a state of expansion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-[rgba(255,255,255,0.08)] relative overflow-hidden group/card shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-[#ff462e]/30 transition-all duration-500">
                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity duration-700 -rotate-12 translate-x-4">
                  <Moon size={180} />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-[#ff462e] border border-white/5 shadow-inner">
                    <Moon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white tracking-tight">1. The Definition</h3>
                    <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#ff462e] opacity-70">Shadow Awareness</p>
                  </div>
                </div>
                <p className="text-base text-slate-400 mb-6 relative z-10 leading-relaxed">
                  Enter **Shadow Mode** to identify the belief that resonates with your current feeling of limitation.
                </p>
                <div className="space-y-3 relative z-10">
                  {['"I am not enough"', '"Money is scarce"', '"I am alone"'].map((t, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-slate-500 bg-white/3 p-3 rounded-xl border border-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      {t}
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-[10px] uppercase tracking-[4px] text-white/40 font-bold relative z-10 italic">Acknowledge it exists.</div>
              </div>

              <div className="bg-[#ff462e]/5 backdrop-blur-3xl p-8 rounded-[2rem] border border-[#ff462e]/10 relative overflow-hidden group/card shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:border-[#ff462e]/40 transition-all duration-500">
                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity duration-700 rotate-12 translate-x-4">
                  <Sun size={180} />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff462e] flex items-center justify-center text-white shadow-[0_10px_20px_rgba(255,70,46,0.35)]">
                    <Sun size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white tracking-tight">2. The Shift</h3>
                    <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#ff462e]">Expansive Light</p>
                  </div>
                </div>
                <p className="text-base text-slate-400 mb-6 relative z-10 leading-relaxed">
                  Flip the card to reveal the **Expansive Thought**. This is your new neural destination.
                </p>
                <div className="space-y-3 relative z-10">
                  {['"I am complete"', '"Money flows easily"', '"I am connected"'].map((t, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-white/90 bg-[#ff462e]/10 p-3 rounded-xl border border-[#ff462e]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff462e]" />
                      {t}
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-[10px] uppercase tracking-[4px] text-[#ff462e] font-bold relative z-10 italic">Choose the new preference.</div>
              </div>
            </div>

            <div className="mt-12 p-8 md:p-12 bg-gradient-to-br from-[#090909] to-[#0f172a] rounded-[2.5rem] border border-[rgba(255,255,255,0.08)] shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,70,46,0.1)_0%,transparent_60%)] pointer-events-none" />
               <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-[#ff462e]/10 flex items-center justify-center border border-[#ff462e]/30 shrink-0 shadow-[0_0_30px_rgba(255,70,46,0.1)]">
                   <RefreshCw className="text-[#ff462e]" size={32} />
                 </div>
                 <div>
                   <h4 className="font-bold text-white text-3xl mb-4 font-serif leading-tight">3. Lock it in <span className="text-[#ff462e]">(The Anchor)</span></h4>
                   <p className="text-slate-300 mb-8 text-lg leading-relaxed">
                     Once you have chosen the new definition, you must <strong>act as if</strong> it is true. To anchor this shift permanently into your physical space:
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                       'Open the Studio by clicking any expansive card.',
                       'Select the typography and color that matches your new state.',
                       'Download the high-fidelity artwork.',
                       'Set it as your Phone Wallpaper or Frame it on your path.'
                     ].map((step, i) => (
                       <div key={i} className="flex items-center gap-4 bg-white/3 border border-white/5 p-4 rounded-2xl group transition-all hover:bg-white/5">
                         <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#ff462e] shrink-0">{i+1}</div>
                         <p className="text-sm text-slate-400 font-medium">{step}</p>
                       </div>
                     ))}
                   </div>
                   <div className="mt-10 p-5 rounded-2xl bg-[#ff462e]/5 border border-[#ff462e]/10 backdrop-blur-md">
                     <p className="text-sm text-slate-400 italic leading-relaxed">
                       Every time you look at your anchored piece, you are reminded of your new definition. This reinforces the neural pathway until it becomes your natural state of being.
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConceptGuide;