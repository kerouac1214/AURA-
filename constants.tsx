
import { FunctionMode, ModeConfig, SubMode } from './types';

export const MODES: ModeConfig[] = [
  {
    id: FunctionMode.GRID_STORY,
    label: '九宫格电影印样',
    description: '通过多景别、多表情的连贯排版，捕捉身份一致性下的动态叙事瞬间。',
    icon: 'LayoutGrid',
    lighting: '一致性影棚光',
    tags: ['剧情长图', '朋友圈', '故事板'],
    previewUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: FunctionMode.CINEMATIC,
    label: '胶片叙事',
    description: '电影感质感渲染，精准捕捉光影细节，让每一张肖像都拥有叙事生命力。',
    icon: 'Camera',
    lighting: '电影级氛围布光',
    tags: ['氛围感', '胶片', '故事'],
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: FunctionMode.GLAMOUR,
    label: '华丽人像',
    description: '重塑明星质感，提供极致美妆大片级皮肤细节，展现充满自信的时尚张力。',
    icon: 'Sparkles',
    lighting: '蝴蝶光 / 影棚高光',
    tags: ['时尚', '美妆', '名流'],
    previewUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: FunctionMode.BUSINESS,
    label: '职业商务照',
    description: '瞬时塑造职场精英范，支持自动匹配行业着装与专业影棚光效。',
    icon: 'Briefcase',
    lighting: '动态适配布光',
    tags: ['职场', 'LinkedIn', '个人品牌'],
    previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: FunctionMode.Y2K_SELFIE,
    label: 'Y2K 复古自拍',
    description: '致敬千禧年低保真美学，模拟早期数码相机直闪质感，重回怀旧流行巅峰。',
    icon: 'Zap',
    lighting: '强直闪光 (Harsh Flash)',
    tags: ['复古', '辣妹', '社交媒体'],
    previewUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: FunctionMode.KIDS,
    label: '儿童摄影',
    description: '记录纯真童年，最高等级安全隐私保护，完美保留宝宝的神情细节。',
    icon: 'Baby',
    lighting: '柔和无影布光',
    tags: ['萌娃', '家庭', '纪念'],
    previewUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1455582916367-25f75bdb628f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: FunctionMode.CREATIVE,
    label: '创意维度',
    description: '重构视觉边界，将真人特征映射至艺术空间，开启无限的风格化可能。',
    icon: 'Palette',
    lighting: '多变创意布光',
    tags: ['潮流', '3D', '艺术'],
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    comparisonUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
  }
];

export const NINE_GRID_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_EMOTIONAL_ACTING', label: '情绪大头贴' },
  { id: 'STYLE_02_FASHION_LOOKBOOK', label: '高定叙事', description: '暖钨丝主光对撞冷蓝轮廓光，混合焦段覆盖从全景剪影到微距瞳孔的时尚叙事。' },
  { id: 'STYLE_03_BICHROMATIC_ART', label: '黑白影调', description: '高对比黑白电影摄影，9个格子覆盖从大远景到大特写的完整镜头光谱。' },
  { id: 'STYLE_04_JAPANESE_PHOTOBOOK', label: '日式写真集' },
  { id: 'STYLE_05_CINEMATIC_STORYBOARD', label: '电影故事板', description: '模拟武侠史诗电影（张艺谋/王家卫风格），以九宫格叙事展现中国古风英雄之旅。' },
  { id: 'STYLE_06_Y2K_SCRAPBOOK', label: 'Y2K 辣妹手账' },
  { id: 'STYLE_07_FESTIVE_CNY', label: '新春红妆' },
  { id: 'STYLE_08_CHINESE_CLASSICAL', label: '中国古风', description: '以宋代极简美学为基调，通过水墨影调与留白艺术，展现东方禅意的人像摄影。' },
  { id: 'STYLE_09_CAREER_MATRIX', label: '职业图鉴', description: '同一身份在九种不同职业间的平行转译，从医生、飞行员到赛车手，探索职业多元可能。' }
];

export const PROFESSIONAL_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_CLASSIC_CORPORATE', label: '经典商务', description: '严谨、权威、传统深色正装。' },
  { id: 'STYLE_02_SILICON_VALLEY', label: '硅谷精英', description: '智能、简约、高科技开放式环境。' },
  { id: 'STYLE_03_ENV_EXPERT', label: '环境专家', description: '根据职业属性自动生成特定工作环境。' },
  { id: 'STYLE_04_EDITORIAL_BOLD', label: '杂志社论', description: '戏剧性布光，大胆自信的艺术感。' },
  { id: 'STYLE_05_LINKEDIN_FRIENDLY', label: '亲和力社交', description: '温暖、明亮、极具个人感染力。' }
];

export const CINEMATIC_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_KODAK_GOLD', label: '暖调怀旧', description: '柯达 Portra 400 质感，金黄落日余晖。' },
  { id: 'STYLE_02_BLUE_MELANCHOLY', label: '蓝调忧郁', description: '富士胶片青色阴影，冷色调情绪感。' },
  { id: 'STYLE_03_HONG_KONG_NEON', label: '港风霓虹', description: '王家卫美学，红绿撞色与梦幻重影。' },
  { id: 'STYLE_04_TIMELESS_NOIR', label: '经典黑白', description: '极端明暗对比，极致纹理与情感深度。' },
  { id: 'STYLE_05_JAPANESE_AIRY', label: '日系空气感', description: '高调自然光，通透清新，生活化抓拍。' },
  { id: 'STYLE_06_WES_ANDERSON', label: '韦斯·安德森', description: '绝对对称构图，马卡龙配色，画册感。' },
  { id: 'STYLE_07_VOGUE_STREET', label: 'Vogue 街拍', description: '超长焦压缩感，行走间的自信时尚。' },
  { id: 'STYLE_08_ETHEREAL_DREAM', label: '迷雾仙境', description: '丁达尔效应，丁香色薄雾与微光。' },
  { id: 'STYLE_09_CHINESE_CLASSICAL_SINGLE', label: '中国古风', description: '专注于东方画意，将水墨禅意、大唐华美与武侠意境融合为一帧电影海报。' }
];

export const GLAMOUR_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_VINTAGE_HOLLYWOOD', label: '经典好莱坞', description: '派拉蒙式蝴蝶布光，高对比黑白，银幕女神感。' },
  { 
    id: 'STYLE_02_BACKSTAGE_ANGEL', 
    label: '写真时刻', 
    description: 'The original image was transformed into a dramatic, photorealistic, and ultra-detailed set of four distinct characters, each captured with a medium-close-up wide-angle lens, featuring dynamic shooting angles, complex and powerful poses, and backgrounds that are expanded versions of the original environment with cinematic lighting, high contrast, crisp textures, and accurate color grading.' 
  },
  { id: 'STYLE_03_HIGH_END_BEAUTY', label: '极致美妆', description: '超近景大特写，毛孔级真实皮肤纹理，水润通透。' },
  { id: 'STYLE_04_RED_CARPET', label: '红毯名流', description: '高定礼服，钻石珠宝，布满狗仔队闪光灯背景。' },
  { id: 'STYLE_05_VOGUE_MINIMALIST', label: '极简杂志', description: '无缝影棚背景，三点式柔和布光，强烈个人姿态。' },
  { id: 'STYLE_06_ETHEREAL_GLOW', label: '梦幻柔光', description: '丁达尔轮廓光，薄纱与花卉，浪漫柔焦质感。' }
];

export const CREATIVE_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_3D_BLIND_BOX', label: '3D 盲盒公仔', description: '泡泡玛特风格，Octane 渲染 PVC 材质，Q 版可爱。' },
  { id: 'STYLE_02_BRICK_MINIFIGURE', label: '乐高积木人', description: 'ABS 塑料高光，经典乐高结构，微距摄影感。' },
  { id: 'STYLE_03_FLUFFY_PLUSHIE', label: '毛绒大头贴', description: '极致毛绒质感，温暖大头贴布光，Jellycat 风格。' },
  { id: 'STYLE_04_CLAYMATION', label: '粘土定格动画', description: '粘土材质与指纹痕迹，定格动画电影美学。' },
  { id: 'STYLE_05_ISOMETRIC_DIORAMA', label: '微缩世界', description: '等轴测视角，悬浮小岛上的微缩个人空间。' },
  { id: 'STYLE_06_VECTOR_STICKER', label: '极简矢量贴纸', description: '平面矢量插画，加粗白色切边，贴纸艺术感。' },
  { id: 'STYLE_07_TECH_KNOLLING', label: '机械解构', description: '赛博机械内构，精密排列的零件与电路板。' },
  { id: 'STYLE_08_PIXAR_3D', label: '皮克斯动画', description: '迪士尼电影级渲染，生动夸张的五官，质感通透。' },
  { 
    id: 'STYLE_09_RETRO_PIXEL', 
    label: '3D 情绪漫改', 
    description: 'Pixar–Illumination hybrid visual language. High resolution, Clay-style material finish with subsurface scattering. Hyper-expressive characters with preserved facial markers.' 
  }
];

export const KIDS_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_NEWBORN_PURITY', label: '纯净新生', description: '安妮·格德斯风格艺术照，柔和窗光，针织包被，纯净空灵。' },
  { id: 'STYLE_02_CANDID_LIFESTYLE', label: '童真纪实', description: '生活抓拍，大笑、嬉戏等不经意的瞬间，真实自然。' },
  { id: 'STYLE_03_HIGH_FASHION_KID', label: '商业童模', description: 'Zara/H&M 风格，街头穿搭，自信姿态，纯色影棚背景。' },
  { id: 'STYLE_04_ENCHANTED_FOREST', label: '魔法森林', description: '童话秘境，丁达尔效应，萤火虫与魔法袍，奇幻色彩。' },
  { id: 'STYLE_05_PIXAR_PROTAGONIST', label: '皮克斯主角', description: '3D 动画化，生动的五官，夸张可爱的比例，鲜活质感。' },
  { id: 'STYLE_06_GHIBLI_ANIME', label: '吉卜力画风', description: '龙猫美学，手绘质感背景，蓝天白云绿草地，怀旧清新。' },
  { id: 'STYLE_07_WES_ANDERSON_KID', label: '韦斯·安德森', description: '严谨中心对称，复古童军服，马卡龙配色，冷面幽默。' },
  { id: 'STYLE_08_MINI_PROFESSIONAL', label: '职业体验', description: '穿上特大号职业装，化身小小医生/宇航员/厨师，充满志向。' },
  { id: 'STYLE_09_FESTIVE_CELEBRATION', label: '节日庆典', description: '生日/圣诞/新年氛围，温暖烛光或彩灯，充满幸福感。' }
];

export const Y2K_SUBMODES: SubMode[] = [
  { id: 'STYLE_01_CCD_MIRROR', label: 'CCD 浴室对镜', description: '紧凑型数码相机风格，镜面强闪光反射，杂乱真实的卧室背景。' },
  { id: 'STYLE_02_PARTY_BADDIE', label: '派对辣妹', description: 'Juicy Couture 天鹅绒套装，蓝色眼影，暗光环境下直闪拍摄。' },
  { id: 'STYLE_03_FISHEYE_PEEP', label: '鱼眼大头贴', description: '12mm 鱼眼镜头，大头小身畸变效果，MV 既视感。' },
  { id: 'STYLE_04_PURIKURA', label: '贴纸大头贴', description: '日式大头贴机器，极致磨皮，手绘涂鸦与星星边框。' },
  { id: 'STYLE_05_FLIP_PHONE', label: '翻盖机自拍', description: '低分辨率像素感，高角度 Myspace 俯拍视角，橙色数字日期戳。' },
  { id: 'STYLE_06_SCRAPBOOK', label: '剪贴簿手账', description: '拼贴风格，胶带、拍立得边框与闪粉贴纸叠加。' },
  { id: 'STYLE_07_CYBERCORE', label: '赛博数码', description: '银色、荧光绿、生物蓝，金属感服饰，操作系统的美学。' },
  { id: 'STYLE_08_NEON_NIGHT', label: '霓虹复古夜', description: '夜晚车内环境，高 ISO 颗粒（3200），霓虹仪表盘光影与动态模糊。' },
  { id: 'STYLE_09_DREAMCORE', label: '梦核空间', description: '过度曝光的梦幻光晕，空旷的商场 or 无限草地，诡异而怀旧。' }
];

// Content Enhancements Presets for each mode
export const MODE_CONTENT_PRESETS: Record<string, string[]> = {
  [FunctionMode.BUSINESS]: ["律师", "医生", "高管", "程序员", "建筑师", "大学教授", "金融分析师", "产品经理"],
  [FunctionMode.CINEMATIC]: ["雨夜街道", "复古咖啡馆", "繁华大都市", "寂静图书馆", "深秋森林", "科幻控制室"],
  [FunctionMode.KIDS]: ["抱着玩具熊", "在吃大号棒棒糖", "戴着红色毛线帽", "吹泡泡", "在花园荡秋千"],
  [FunctionMode.CREATIVE]: ["超级英雄", "星际宇航员", "蒸汽朋克侦探", "魔法师", "未来主义机器人", "赛博武士"],
  [FunctionMode.GLAMOUR]: ["佩戴珍珠项链", "穿着晚礼服", "手拿香槟", "戴着复古墨镜", "站在红毯中央"],
  [FunctionMode.Y2K_SELFIE]: ["挂脖背心", "头戴式有线耳机", "手持翻盖手机", "吃着彩虹棒棒糖", "佩戴彩色发夹"],
  [FunctionMode.GRID_STORY]: ["多种夸张表情", "不同情绪转折", "时装周走秀", "周末生活碎片"]
};

export const SYSTEM_INSTRUCTION = `
**[ROLE: AURA VISUAL DIRECTOR]**
You are a world-class Visual Director and Expert Prompt Engineer. Your specialty is translating human identity into high-end, cinematic, or stylized photographic masterpieces.

**[CORE MISSION]**
Generate a **Precise Hyper-Realistic Image Prompt** that achieves two things:
1. **Absolute Identity Consistency**: The subject's facial bone structure, eye shape, and unique biological markers from the reference MUST be preserved.
2. **Master-Level Artistic Execution**: The output must look like a high-budget production.

**[IDENTITY LOCK PROTOCOL]**
Analyze the provided images for nasal bridge height, jawline sharpness, eyelid folds, and skin texture.
Directive: Use descriptive adjectives for these features to "lock" the AI's generation around the user's DNA.

**[DIRECTOR'S AESTHETIC GUIDELINES]**
- **Lighting**: Specify light sources (e.g., "warm tungsten key light", "cool rim light").
- **Optics**: Specify lenses (e.g., "85mm f/1.2 prime lens", "35mm anamorphic").
- **Texture**: For skin, use "pore-level detail", "subsurface scattering".

**[FUNCTION MODE OVERRIDES]**
- **NINE-GRID STORY**:
  - *Structure*: Rendered as a SINGLE COHESIVE IMAGE representing a 3x3 grid collage with clean white gutters.
  - *Consistency*: Identity must be 100% identical across all 9 panels within this single image.
  - *Execution*: This is ONE generation request for ONE image that contains a collage layout.
  - *Sub-Mode: STYLE_03_BICHROMATIC_ART (Cinematic Noir)*:
    - Focus: High-contrast B&W photography. Dramatic Chiaroscuro.
    - Grid Shot Matrix: 9 panels including Wide-angle (24mm), High-angle, Silhouette profile, 3/4 turn, Classic center portrait (85mm), Over-shoulder, Macro eye, Close-up lips, Hand gesture.
  - *Sub-Mode: STYLE_02_FASHION_LOOKBOOK (Editorial Haute Couture)*:
    - Focus: Editorial Campaign Bi-Color Lighting (Warm Tungsten Key 3200K vs Cool Blue Rim).
    - Grid Shot Matrix: 1. Wide Silhouette, 2. Medium Pose, 3. Low-angle Power, 4. Macro Eye, 5. Center Portrait, 6. Lip/Neck close-up, 7. Side Profile, 8. Overhead, 9. Motion hair.
  - *Sub-Mode: STYLE_09_CAREER_MATRIX (Career Multiverse)*:
    - Focus: Same subject in 9 high-end professional roles. Commercial Stock aesthetic.
    - Roles & Contexts: 1. Doctor, 2. Lawyer, 3. Scientist, 4. Chef, 5. Celebrity, 6. Architect, 7. Pilot, 8. Police, 9. Athlete.
  - *Sub-Mode: STYLE_05_CINEMATIC_STORYBOARD (Chinese Wuxia Epic)*:
    - Focus: Chinese Period Drama / Wuxia film aesthetic (Zhang Yimou/Wong Kar-wai style).
    - Aesthetic: Ink-wash desaturated tones or Vermilion & Gold.
    - Narrative: 3-Act sequence chronologically across 9 panels.
  - *Sub-Mode: STYLE_08_CHINESE_CLASSICAL (Chinese Classical / Ink Wash Aesthetic)*:
    - Focus: Song Dynasty Minimalism, Pictorialism, Zen atmosphere.
    - Aesthetic: Traditional Ink Wash Painting (Shui-mo) meets Vogue China Editorial. Desaturated mineral colors (Cyan-Blue, Tea White, Ink Black). 
    - Key Concept: Negative Space (Liubai), ethereal fog, delicate Hanfu silk texture.
    - Grid Matrix: 1. Wide Landscape, 2. Close-up hands, 3. Motion Flow, 4. Silhouette profile, 5. Center Portrait, 6. Red wall interaction, 7. Macro Eye, 8. Back view, 9. Shadow abstract.

**[CHINESE CLASSICAL PORTRAIT (SINGLE SHOT)]**
For 'STYLE_09_CHINESE_CLASSICAL_SINGLE' in Cinematic mode:
- Focus on a SINGLE MASTERPIECE portrait photography.
- Randomize between 3 aesthetics: 
  1. Ink Wash (Shui-mo) Aesthetic: Desaturated monochromatic tones, ink black, foggy white background, misty bamboo forest.
  2. Forbidden City Gold (Royal): High-contrast Vermilion red, antique gold, intricate palace lattice windows, warm candle lighting.
  3. Wuxia Solitude: Cold steel blue and charcoal grey palette, snowy mountain inn, dynamic hanfu fabric motion with volumetric fog.
- Emphasize 'Oriental Pictorialism', porcelain skin, and poetic negative space.

**[FINAL OUTPUT REQUIREMENTS]**
- Return ONLY valid JSON: {"generated_prompt": "..."}.
- The prompt must be in English.
- Avoid flowery filler; use technical keywords.
- Include "Identity consistency is absolute priority" at the start.
`;
