
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { FunctionMode } from "../types";

/**
 * Select the best reference images based on quality and angle.
 */
const selectBestReferenceImages = async (base64Images: string[]): Promise<string[]> => {
  if (base64Images.length <= 3) return base64Images;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imageParts = base64Images.map((img, i) => ({
    inlineData: { mimeType: 'image/jpeg', data: img.split(',')[1] },
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          ...imageParts,
          { text: "Analyze these photos. Select the top 3 indices that are clearest, have best lighting, and show different facial angles (front/side). Return JSON: {\"best_indices\": [number, number, number]}" }
        ]
      },
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || '';
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const { best_indices } = JSON.parse(cleanedText || '{"best_indices": [0,1,2]}');
    return best_indices.map((idx: number) => base64Images[idx] || base64Images[0]).slice(0, 3);
  } catch (err) {
    console.warn("Reference selection failed, using defaults", err);
    return base64Images.slice(0, 3);
  }
};

export const analyzeAndGeneratePrompt = async (
  base64Images: string[],
  mode: string,
  lighting: string,
  subMode: string | null = null,
  occupation: string | null = null
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = base64Images.slice(0, 3).map(img => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: img.split(',')[1],
    },
  }));

  let modeSpecificInstruction = `Target Mode: ${mode}\nTarget Style: ${subMode || 'Standard Cinematic'}\nUser Context/Details: ${occupation || 'None'}`;

  // 9-Grid Logic
  if (mode === FunctionMode.GRID_STORY) {
    if (subMode === 'STYLE_03_BICHROMATIC_ART') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: Cinematic Noir 3x3 contact sheet. 
      1. PROMPT MUST DESCRIBE A 3X3 GRID COLLAGE IN ONE IMAGE.
      2. STYLE: High-contrast B&W, Ray-traced lighting, deep shadows, ivory highlights.
      3. SHOT MATRIX: 24mm Wide, 85mm Center Portrait, Macro Eye, Silhouette Profile.
      `;
    } else if (subMode === 'STYLE_02_FASHION_LOOKBOOK') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: Editorial Haute Couture 3x3 contact sheet.
      1. PROMPT MUST DESCRIBE A 3X3 GRID COLLAGE IN ONE IMAGE.
      2. LIGHTING (CRITICAL): Bi-color contrast: "Warm Tungsten Key Light (3200K)" on face + "Cool Blue Rim Light" on hair/shoulders.
      3. SHOT MATRIX: Wide Silhouette, Macro Eye, Low-angle Power, Frontal Portrait.
      `;
    } else if (subMode === 'STYLE_09_CAREER_MATRIX') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: Career Multiverse 3x3 contact sheet.
      1. PROMPT MUST DESCRIBE A 3X3 GRID COLLAGE IN ONE IMAGE showing the SAME woman in 9 different professional roles.
      2. ROLES: Doctor, Lawyer, Scientist, Chef, Celebrity, Architect, Pilot, Police, Athlete.
      `;
    } else if (subMode === 'STYLE_05_CINEMATIC_STORYBOARD') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: Chinese Wuxia Epic 3x3 contact sheet.
      1. PROMPT MUST DESCRIBE A 3X3 GRID COLLAGE IN ONE IMAGE showing a chronological 3-act film sequence.
      2. GENRE: Chinese Period Drama / Wuxia Epic.
      `;
    } else if (subMode === 'STYLE_08_CHINESE_CLASSICAL') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: Chinese Classical / Ink Wash Aesthetic 3x3 contact sheet.
      1. PROMPT MUST DESCRIBE A 3X3 GRID COLLAGE IN ONE IMAGE.
      2. AESTHETIC: Traditional Ink Wash Painting (Shui-mo), Song Dynasty Minimalism, Zen atmosphere.
      `;
    }
  } 
  
  // Creative Mode Logic
  if (mode === FunctionMode.CREATIVE) {
    if (subMode === 'STYLE_09_RETRO_PIXEL') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: 3D Expressive Cartoon (Pixar/Illumination Hybrid).
      1. VISUAL LANGUAGE: Pixar–Illumination hybrid. High resolution, Clay-style material finish with subsurface scattering.
      2. IDENTITY: Faithfully preserve facial markers (skin tone, nose shape, bone structure, beard/stubble) while exaggerating proportions for a stylized look.
      3. EXPRESSION: Surprise or Shock (High Intensity). Dramatically open mouth, thick glossy lips, expressive bulging eyes for comedic impact.
      4. ACCESSORIES: Include earrings, bandanas, chains, or glasses from the source image with realistic metallic/fabric textures.
      5. CINEMATOGRAPHY: Sharp Key Light (Left) + Soft Fill (Right) + Rim Light (Back). Clean gradient studio background.
      6. NEGATIVE: 2D, flat, illustration, vector, blurry textures.
      `;
    }
  }

  // Cinematic Single Shot Logic
  if (mode === FunctionMode.CINEMATIC && subMode === 'STYLE_09_CHINESE_CLASSICAL_SINGLE') {
      modeSpecificInstruction += `
      URGENT SPECIAL INSTRUCTION: Chinese Classical / Oriental Zen SINGLE SHOT.
      1. FORMAT: A SINGLE masterpiece cinematic image (NOT A GRID). 
      2. SCENARIO ENGINE: Randomly pick ONE of these 3 vibes for the final prompt:
         - A: Ink Wash (Shui-mo) Aesthetic: Desaturated monochromatic tones, ink black, foggy white background, misty bamboo forest.
         - B: Forbidden City Gold (Royal): High-contrast Vermilion red, antique gold, intricate palace lattice windows, warm candle lighting.
         - C: Wuxia Solitude: Cold steel blue and charcoal grey palette, snowy mountain inn, dynamic hanfu fabric motion with volumetric fog.
      3. CINEMATOGRAPHY: 85mm f/1.2 lens, extreme shallow depth of field, porcelain skin texture, poetic negative space (Liubai).
      4. SUBJECT: Preserve East Asian identity (heart-shaped face, double eyelids).
      5. NEGATIVE: Grid, collage, modern clothing, cyberpunk, western features, high saturation.
      `;
  }
  
  const promptPart = {
    text: `DIRECTOR'S BRIEF:
    ${modeSpecificInstruction}
    
    GENERAL INSTRUCTIONS:
    1. Lock the subject's identity using the provided reference images.
    2. Design the lighting and environment to match the target mode perfectly.
    3. Return a technical, high-fidelity image generation prompt.
    4. Format: JSON with key "generated_prompt".`
  };

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [...imageParts, promptPart] },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.6,
      responseMimeType: "application/json"
    },
  });

  try {
    const text = response.text || '';
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const json = JSON.parse(cleanedText);
    return json.generated_prompt || text;
  } catch (err) {
    console.error("Prompt parsing failed", err);
    return response.text || "Failed to generate prompt.";
  }
};

export const generateFinalImage = async (
  prompt: string,
  referenceImages: string[],
  aspectRatio: string = "3:4",
  useUltraEngine: boolean = false
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const bestRefs = await selectBestReferenceImages(referenceImages);
  
  const imageParts = bestRefs.map(img => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: img.split(',')[1],
    },
  }));

  const model = useUltraEngine ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          ...imageParts,
          { text: `${prompt}\n\nSTRICT IDENTITY LOCK: Preserve facial bone structure and biological markers.` }
        ]
      },
      config: {
          imageConfig: {
              aspectRatio: aspectRatio as any
          }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (err: any) {
    const errorMsg = err.message?.toLowerCase() || "";
    if (useUltraEngine && (errorMsg.includes('403') || errorMsg.includes('permission') || errorMsg.includes('not found'))) {
      throw new Error("PRO_KEY_REQUIRED");
    }
    throw err;
  }

  throw new Error("Visual transformation failed to produce an image.");
};
