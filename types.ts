
export enum FunctionMode {
  BUSINESS = 'Business_Headshot',
  BLIND_BOX = '3D_Blind_Box',
  CINEMATIC = 'Cinematic_Film',
  LUXURY = 'Luxury_Product',
  CYBERPUNK = 'Cyberpunk_Hero',
  GLAMOUR = 'Studio_Glamour',
  GRID_STORY = '9_Grid_Story',
  INFOGRAPHIC = 'Infographic_Edu',
  KNOLLING = 'Knolling_Deconstruction',
  Y2K_SELFIE = 'Y2K_Selfie',
  CREATIVE = 'Creative_Dimension',
  KIDS = 'Kids_Photography'
}

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface SubMode {
  id: string;
  label: string;
  description?: string;
}

export interface ModeConfig {
  id: FunctionMode;
  label: string;
  description: string;
  icon: string;
  lighting: string;
  tags: string[];
  previewUrl: string;
  comparisonUrl: string;
}

export interface VisualState {
  originalImages: string[];
  mode: FunctionMode | null;
  subMode: string | null;
  occupation: string | null; // For Business Mode
  aspectRatio: AspectRatio;
  isProcessing: boolean;
  generatedPrompt: string | null;
  resultImage: string | null;
  error: string | null;
  step: 'gallery' | 'upload' | 'result';
}
