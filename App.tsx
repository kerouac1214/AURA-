
// Add React import to resolve namespace errors for React.FC and React.ChangeEvent
import React, { useState, useEffect } from 'react';
import { Upload, RefreshCw, ChevronRight, AlertCircle, Sparkles, LayoutGrid, ArrowLeft, Layers, Wand2, ShieldCheck, History, Info, Zap, ExternalLink, Download, Settings2, ToggleLeft, ToggleRight, Maximize2, Shield, Lock } from 'lucide-react';
import { MODES, NINE_GRID_SUBMODES, PROFESSIONAL_SUBMODES, CINEMATIC_SUBMODES, GLAMOUR_SUBMODES, CREATIVE_SUBMODES, KIDS_SUBMODES, Y2K_SUBMODES, MODE_CONTENT_PRESETS } from './constants';
import { FunctionMode, VisualState, ModeConfig, AspectRatio } from './types';
import { analyzeAndGeneratePrompt, generateFinalImage } from './services/geminiService';
import Icon from './components/Icon';

const STORAGE_KEY = 'aura_last_result';

const StyleCard: React.FC<{ 
  mode: ModeConfig; 
  onSelect: (id: FunctionMode) => void;
}> = ({ mode, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(mode.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative glass-panel rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-500/50 transition-all text-left flex flex-col"
    >
      <div className="aspect-[4/5] bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 transition-opacity duration-500 overflow-hidden">
          <img src={mode.previewUrl} className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`} alt={mode.label} />
          <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ clipPath: isHovered ? 'inset(0 50% 0 0)' : 'inset(0 100% 0 0)', transition: 'clip-path 0.4s ease-out' }}>
            <img src={mode.comparisonUrl} className="w-full h-full object-cover brightness-75" alt="Original" />
          </div>
          <div className="absolute bottom-3 right-3 bg-yellow-500/90 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter text-black z-20">
            真实质感
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />
        <div className="z-20 absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 mb-0.5">
             <div className="w-6 h-6 rounded-lg banana-gradient flex items-center justify-center text-black">
                <Icon name={mode.icon} className="w-3.5 h-3.5" />
             </div>
             <h3 className="text-base font-bold font-heading">{mode.label}</h3>
          </div>
        </div>
      </div>
      <div className="p-3 bg-neutral-900/60 backdrop-blur-sm">
        <p className="text-neutral-400 text-[11px] line-clamp-2 min-h-[2rem] leading-relaxed">{mode.description}</p>
      </div>
    </button>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<VisualState & { auditStatus?: string, useUltraEngine?: boolean }>({
    originalImages: [],
    mode: null,
    subMode: null,
    occupation: null,
    aspectRatio: '3:4',
    isProcessing: false,
    generatedPrompt: null,
    resultImage: null,
    error: null,
    step: 'gallery',
    useUltraEngine: false
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ 
          ...prev, 
          resultImage: parsed.resultImage, 
          generatedPrompt: parsed.generatedPrompt,
          mode: parsed.mode,
          step: parsed.resultImage ? 'result' : 'gallery'
        }));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (state.resultImage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        resultImage: state.resultImage,
        generatedPrompt: state.generatedPrompt,
        mode: state.mode
      }));
    }
  }, [state.resultImage, state.generatedPrompt, state.mode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 8) as File[];
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(images => {
        setState(prev => ({ 
          ...prev, 
          originalImages: [...prev.originalImages, ...images].slice(0, 8),
          error: null 
        }));
      });
    }
  };

  const startProcessing = async (forceStandard: boolean = false) => {
    if (state.originalImages.length === 0 || !state.mode) return;
    if (!state.subMode) {
      setState(prev => ({ ...prev, error: "请选择一个子风格以继续。" }));
      return;
    }

    const actualUseUltra = forceStandard ? false : !!state.useUltraEngine;

    if (actualUseUltra) {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await aistudio.openSelectKey();
        }
      }
    }

    setState(prev => ({ 
        ...prev, 
        isProcessing: true, 
        error: null, 
        auditStatus: actualUseUltra ? "正在启动顶级 Ultra 渲染引擎..." : "正在启动标准渲染引擎...",
    }));
    
    try {
      const selectedModeConfig = MODES.find(m => m.id === state.mode)!;
      const prompt = await analyzeAndGeneratePrompt(state.originalImages, state.mode, selectedModeConfig.lighting, state.subMode, state.occupation);
      setState(prev => ({ ...prev, generatedPrompt: prompt, auditStatus: "同步真实本我与光影转译..." }));

      const finalImage = await generateFinalImage(prompt, state.originalImages, state.aspectRatio, actualUseUltra);
      
      setState(prev => ({ ...prev, resultImage: finalImage, isProcessing: false, step: 'result', auditStatus: undefined }));
    } catch (err: any) {
      console.error("Processing error:", err);
      let errorMessage = err.message || "视觉引擎启动失败。";
      
      if (err.message === "PRO_KEY_REQUIRED") {
        errorMessage = "检测到权限拒绝 (403)。Ultra 模式要求 API Key 必须来自已绑定结算账户的付费 Google Cloud 项目。即使您有免费额度，也需要完成项目付费绑定以解锁顶级模型。";
      } else if (err.message.includes("SAFETY")) {
          errorMessage = "生成内容被安全过滤器拦截。请尝试更换描述或上传更清晰的参考图。";
      }

      setState(prev => ({ ...prev, isProcessing: false, error: errorMessage, auditStatus: undefined }));
    }
  };

  const downloadImage = () => {
    if (!state.resultImage) return;
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `aura-masterpiece-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      originalImages: [],
      mode: null,
      subMode: null,
      occupation: null,
      aspectRatio: '3:4',
      isProcessing: false,
      generatedPrompt: null,
      resultImage: null,
      error: null,
      step: 'gallery',
      useUltraEngine: false
    });
  };

  const handleModeSelect = (id: FunctionMode) => {
    let defaultRatio: AspectRatio = '3:4';
    if (id === FunctionMode.CINEMATIC) defaultRatio = '16:9';
    if (id === FunctionMode.GRID_STORY || id === FunctionMode.CREATIVE) defaultRatio = '1:1';
    
    setState(prev => ({ ...prev, mode: id, step: 'upload', aspectRatio: defaultRatio, subMode: null, occupation: null, useUltraEngine: false }));
  };

  const selectedModeConfig = MODES.find(m => m.id === state.mode);
  const currentPresets = state.mode ? (MODE_CONTENT_PRESETS[state.mode] || []) : [];
  const aspectRatios: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];

  return (
    <div className="min-h-screen flex flex-col items-center p-3 md:p-6 bg-[#080808]">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-6 md:mb-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-8 h-8 banana-gradient rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Sparkles className="text-black w-5 h-5" />
          </div>
          <h1 className="text-xl font-heading font-bold tracking-tight">
            AURA <span className="banana-text">灵光</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <div className={`flex items-center gap-1.5 ${state.step === 'gallery' ? 'text-white' : ''}`}><span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px]">1</span> 风格大厅</div>
            <ChevronRight className="w-3 h-3 text-neutral-800" />
            <div className={`flex items-center gap-1.5 ${state.step === 'upload' ? 'text-white' : ''}`}><span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px]">2</span> 真实锁定</div>
            <ChevronRight className="w-3 h-3 text-neutral-800" />
            <div className={`flex items-center gap-1.5 ${state.step === 'result' ? 'text-white' : ''}`}><span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px]">3</span> 渲染原片</div>
        </div>
      </header>

      <main className="w-full max-w-6xl flex-1 flex flex-col items-center">
        {state.error && (
          <div className="w-full mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-xs font-bold mb-0.5">渲染引擎权限异常</p>
                    <p className="text-[10px] opacity-80 leading-relaxed">{state.error}</p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => (window as any).aistudio?.openSelectKey()} className="flex-1 px-3 py-2 bg-white text-black hover:bg-neutral-200 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> 选择 API Key
                </button>
                <button onClick={() => startProcessing(true)} className="flex-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-yellow-500 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> 降级渲染
                </button>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {state.step === 'gallery' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
              {MODES.map((mode) => <StyleCard key={mode.id} mode={mode} onSelect={handleModeSelect} />)}
            </div>
          </div>
        )}

        {/* UPLOAD & CONFIG */}
        {state.step === 'upload' && !state.isProcessing && (
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex-1 space-y-6">
              <button onClick={() => setState(prev => ({ ...prev, step: 'gallery' }))} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> 返回风格大厅
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl banana-gradient flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
                    <Icon name={selectedModeConfig?.icon || 'Sparkles'} className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-heading font-bold">{selectedModeConfig?.label}</h2>
                    <p className="text-neutral-400 text-xs">{selectedModeConfig?.description}</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Sub-Mode Matrix */}
                <div className="space-y-2">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> 子风格矩阵</div>
                    <div className="grid grid-cols-3 gap-2">
                      {(state.mode === FunctionMode.BUSINESS ? PROFESSIONAL_SUBMODES : state.mode === FunctionMode.CINEMATIC ? CINEMATIC_SUBMODES : state.mode === FunctionMode.KIDS ? KIDS_SUBMODES : state.mode === FunctionMode.CREATIVE ? CREATIVE_SUBMODES : state.mode === FunctionMode.GLAMOUR ? GLAMOUR_SUBMODES : state.mode === FunctionMode.Y2K_SELFIE ? Y2K_SUBMODES : NINE_GRID_SUBMODES).map(sub => (
                        <button key={sub.id} onClick={() => setState(prev => ({ ...prev, subMode: sub.id }))} className={`px-3 py-2.5 rounded-xl border text-left transition-all ${state.subMode === sub.id ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}>
                          <p className="font-bold text-[9px] uppercase truncate">{sub.label}</p>
                        </button>
                      ))}
                    </div>
                </div>

                {/* Aspect Ratio & Presets Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5" /> 画面比例</div>
                        <div className="flex flex-wrap gap-1.5">
                            {aspectRatios.map(ratio => (
                                <button 
                                    key={ratio} 
                                    onClick={() => setState(prev => ({ ...prev, aspectRatio: ratio }))} 
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold border transition-all ${state.aspectRatio === ratio ? 'bg-white text-black border-white shadow-md' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-white/20'}`}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5" /> 创意预设</div>
                        <div className="flex flex-wrap gap-1.5">
                            {currentPresets.slice(0, 4).map(p => <button key={p} onClick={() => setState(prev => ({ ...prev, occupation: p }))} className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all ${state.occupation === p ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-white/20'}`}>{p}</button>)}
                        </div>
                    </div>
                </div>

                <input type="text" placeholder="手动输入场景 or 细节 (可选)..." value={state.occupation || ''} onChange={(e) => setState(prev => ({ ...prev, occupation: e.target.value }))} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-xs focus:border-yellow-500 outline-none transition-colors" />

                <div className="p-0.5 glass-panel rounded-2xl border border-neutral-800">
                    <label className="group relative w-full aspect-[21/6] bg-neutral-950/30 rounded-[1.1rem] border-2 border-dashed border-neutral-800 hover:border-yellow-500/20 transition-all cursor-pointer flex items-center justify-center gap-3">
                        <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                        <Upload className="w-5 h-5 text-neutral-500 group-hover:text-yellow-500" />
                        <div className="text-left">
                            <p className="text-[11px] font-bold">捕捉真实本我 (最多 8 张)</p>
                            <p className="text-[9px] text-neutral-600 mb-1">多角度照片可帮助 AI 精准还原您的神韵</p>
                            <div className="flex items-center gap-1 opacity-60">
                                <Lock className="w-2.5 h-2.5 text-yellow-500/70" />
                                <p className="text-[8px] text-neutral-400 font-medium tracking-tight">
                                  这些照片只用于生成你的作品，不进入公开库，不会被用于AI模型训练，不被其他人看到
                                </p>
                            </div>
                        </div>
                    </label>
                </div>

                {state.originalImages.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {state.originalImages.map((img, idx) => (
                            <div key={idx} className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-800 relative group">
                                <img src={img} className="w-full h-full object-cover" />
                                <button onClick={() => setState(prev => ({ ...prev, originalImages: prev.originalImages.filter((_, i) => i !== idx) }))} className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">移除</button>
                            </div>
                        ))}
                    </div>
                )}

                <button disabled={state.originalImages.length === 0 || !state.subMode} onClick={() => startProcessing(false)} className="w-full py-4 banana-gradient disabled:opacity-30 text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
                    启动渲染引擎 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="md:w-64 flex-shrink-0">
               <div className="sticky top-6 space-y-4">
                  <div className="glass-panel rounded-2xl p-4 border border-neutral-800">
                    <h4 className="text-[9px] font-bold uppercase text-neutral-500 mb-3 tracking-widest flex items-center gap-1.5"><Shield className="w-3 h-3" /> 本我一致性保护</h4>
                    <div className="space-y-3 text-[10px]">
                        <div className="flex items-center justify-between">
                            <span className="text-neutral-500">顶级渲染引擎</span>
                            <button 
                                onClick={() => setState(prev => ({ ...prev, useUltraEngine: !prev.useUltraEngine }))}
                                className="focus:outline-none"
                            >
                                {state.useUltraEngine ? (
                                    <ToggleRight className="w-7 h-7 text-yellow-500" />
                                ) : (
                                    <ToggleLeft className="w-7 h-7 text-neutral-700" />
                                )}
                            </button>
                        </div>
                        {state.useUltraEngine && (
                            <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                <p className="text-[8px] text-yellow-500 font-bold uppercase tracking-tighter leading-tight">激活 Ultra：解锁胶片级皮肤纹理与光效</p>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-white/5 pt-3"><span className="text-neutral-500">神韵同步度</span><span className="text-yellow-500">99.8%</span></div>
                        <div className="flex justify-between"><span className="text-neutral-500">环境转译精度</span><span className="text-white">{state.useUltraEngine ? 'Ultra (1K)' : 'Standard'}</span></div>
                    </div>
                  </div>
                  <div className="p-4 glass-panel rounded-2xl border border-neutral-800 bg-yellow-500/[0.01]">
                      <p className="text-[10px] italic text-neutral-500 leading-relaxed font-serif">"AURA 正在学习您的独特韵味。每一帧渲染都将守住您最真实的一面。"</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* PROCESSING */}
        {state.isProcessing && (
          <div className="w-full max-w-xl flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
            <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-2 border-neutral-900 border-t-yellow-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                </div>
            </div>
            <h2 className="text-xl font-heading font-bold mb-3">{state.auditStatus || "启动核心引擎..."}</h2>
            <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden mx-auto">
                <div className="h-full banana-gradient animate-loading-progress" style={{ width: '60%' }} />
            </div>
            <p className="text-neutral-500 text-[9px] mt-4 uppercase tracking-widest animate-pulse">正在同步真实韵味与光影转译...</p>
          </div>
        )}

        {/* RESULT */}
        {state.step === 'result' && !state.isProcessing && (
          <div className="w-full max-w-5xl flex flex-col gap-6 animate-in zoom-in-95">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
              <div className="space-y-4">
                <div className="glass-panel rounded-3xl overflow-hidden border border-neutral-800 relative shadow-2xl">
                  {state.resultImage ? (
                    <img src={state.resultImage} className="w-full h-auto" alt="Generated Masterpiece" />
                  ) : (
                    <div className="aspect-[3/4] flex flex-col items-center justify-center gap-3 bg-neutral-950">
                        <AlertCircle className="w-10 h-10 text-neutral-800" />
                        <p className="text-neutral-600 text-[10px] font-bold uppercase">渲染结果丢失</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <button onClick={downloadImage} className="flex-1 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> 下载原片
                        </button>
                        <button onClick={() => setState(prev => ({ ...prev, step: 'upload' }))} className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-sm font-bold transition-all border border-neutral-800 flex items-center justify-center gap-2">
                            <Settings2 className="w-4 h-4" /> 调整参数
                        </button>
                    </div>
                    <button onClick={reset} className="w-full py-3 banana-gradient text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-yellow-500/20 transition-all">
                        <RefreshCw className="w-4 h-4" /> 重启引擎
                    </button>
                </div>
              </div>

              <div className="flex flex-col gap-6 py-4">
                <div>
                   <h2 className="text-3xl font-heading font-bold mb-3">渲染报告</h2>
                   <p className="text-neutral-400 text-base leading-relaxed font-light">本我特征已成功锁定，真实细节与目标风格完成无缝转译。每一个光影像素都为您精准定制。</p>
                </div>
                <div className="space-y-4">
                    <div className="p-4 glass-panel rounded-2xl border border-neutral-800">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[9px] font-bold uppercase text-yellow-500 tracking-widest flex items-center gap-2"><LayoutGrid className="w-3.5 h-3.5" /> 导演指令 (Prompt)</h4>
                            <History className="w-3.5 h-3.5 text-neutral-600" />
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5 max-h-40 overflow-y-auto">{state.generatedPrompt}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-neutral-900/50 rounded-xl border border-white/5">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-1">引擎版本</p>
                            <p className="text-[10px] font-bold text-white">GEN-2.5 FLASH-PRO</p>
                        </div>
                        <div className="p-3 bg-neutral-900/50 rounded-xl border border-white/5">
                            <p className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest mb-1">本我一致性</p>
                            <p className="text-[10px] font-bold text-yellow-500">EXCELLENT</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER HERO TEXT (Moved to bottom) */}
        <div className="w-full mt-16 md:mt-24 text-center pb-10 border-b border-neutral-900 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            本我一致性保护系统已上线
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tighter">你的数字肖像艺术家</h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed mb-6">
            在这里，我们用最深度的 AI 技术，精准还原每一个独一无二的瞬间。无需快门，让灵感在光影间自由生长。
          </p>
          <div className="bg-yellow-500/[0.03] border border-yellow-500/10 rounded-2xl p-6 max-w-2xl mx-auto">
             <p className="text-yellow-500/80 text-xs md:text-sm font-medium leading-loose">
               AURA 不会“换一张脸给你”，它只是在不同光影与风格中，始终守住“这是你”。<br/>
               不夸张、不网红、不失真。这是 AURA 作为视觉导演的核心修养。
             </p>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl mt-6 pt-6 text-neutral-600 text-[9px] font-bold tracking-widest flex justify-between pb-8 uppercase">
        <p>AURA VISUAL ENGINE v3.5</p>
        <div className="flex gap-3">
            <p>IDENTITY SECURED</p>
            <p className="text-yellow-500/50">•</p>
            <p>MASTER RENDERING</p>
        </div>
      </footer>

      <style>{`
        @keyframes loading-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-loading-progress { animation: loading-progress 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
