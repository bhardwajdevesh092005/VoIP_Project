// Define types for TypeScript (Optional, but recommended)
export type ColorPalette = {
  primary: string;      // Main brand color
  secondary: string;    // Supporting color (less dominant)
  background: string;   // Main screen background
  surface: string;      // Cards, headers, inputs
  text: string;         
  textSecondary: string;// Subtitles, hints
  accent: string;     
  border: string;     
};

export type ThemeType = {
  id: string;
  name: string;
  light: ColorPalette;
  dark: ColorPalette;
};

// The Main Export Object
export const themes: Record<string, ThemeType> = {
  oceanic: {
    id: 'oceanic',
    name: 'Oceanic Blue',
    light: {
      primary: '#00629B',       // Strong Accessible Blue
      secondary: '#E0F2FE',     // Very light blue tint
      background: '#F0F9FF',    // Sky white
      surface: '#FFFFFF',
      text: '#0C4A6E',          // Deep navy for high contrast
      textSecondary: '#546E7A',
      accent: '#EF4444',        // Red (Complementary to blue)
      border: '#BAE6FD',
    },
    dark: {
      primary: '#38BDF8',       // Bright Cyan (pops on dark)
      secondary: '#0C4A6E',     // Deep Navy
      background: '#0F172A',    // Dark Slate
      surface: '#1E293B',       // Slightly lighter slate
      text: '#E0F2FE',          // Pale Blue
      textSecondary: '#94A3B8',
      accent: '#F87171',        // Soft Red
      border: '#334155',
    },
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    light: {
      primary: '#059669',       // Deep Green
      secondary: '#D1FAE5',     // Mint tint
      background: '#F0FDF4',    // Mint white
      surface: '#FFFFFF',
      text: '#064E3B',          // Dark forest green
      textSecondary: '#6B7280',
      accent: '#D97706',        // Amber (Natural harmony)
      border: '#A7F3D0',
    },
    dark: {
      primary: '#34D399',       // Bright Mint
      secondary: '#064E3B',     // Deep Forest
      background: '#064E3B',    // Very dark green
      surface: '#065F46',       // Jungle green
      text: '#ECFDF5',          // Pale mint
      textSecondary: '#A7F3D0',
      accent: '#FBBF24',        // Bright Amber
      border: '#047857',
    },
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    light: {
      primary: '#EA580C',       // Burnt Orange
      secondary: '#FFEDD5',     // Peach tint
      background: '#FFF7ED',    // Warm white
      surface: '#FFFFFF',
      text: '#431407',          // Dark brown text
      textSecondary: '#9A3412',
      accent: '#7C3AED',        // Violet (Triadic harmony)
      border: '#FED7AA',
    },
    dark: {
      primary: '#FB923C',       // Bright Orange
      secondary: '#7C2D12',     // Dark Rust
      background: '#1C1917',    // Warm Black
      surface: '#292524',       // Warm Dark Gray
      text: '#FFEDD5',          // Peach
      textSecondary: '#A8A29E',
      accent: '#A78BFA',        // Lavender
      border: '#44403C',
    },
  },

  royal: {
    id: 'royal',
    name: 'Royal Purple',
    light: {
      primary: '#7C3AED',       // Vivid Purple
      secondary: '#EDE9FE',     // Lavender tint
      background: '#F5F3FF',    // Violet white
      surface: '#FFFFFF',
      text: '#4C1D95',          // Deep Indigo
      textSecondary: '#6D28D9',
      accent: '#10B981',        // Emerald (Split Complementary)
      border: '#DDD6FE',
    },
    dark: {
      primary: '#A78BFA',       // Pastel Purple
      secondary: '#4C1D95',     // Deep Indigo
      background: '#111827',    // Cool Black
      surface: '#1F2937',       // Cool Gray
      text: '#F5F3FF',          // White-violet
      textSecondary: '#9CA3AF',
      accent: '#34D399',        // Mint
      border: '#374151',
    },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal Mono',
    light: {
      primary: '#18181B',       // Near Black
      secondary: '#E4E4E7',     // Light Gray
      background: '#FFFFFF',    // Pure White
      surface: '#F4F4F5',       // Off White
      text: '#18181B',          // Black
      textSecondary: '#71717A', // Medium Gray
      accent: '#2563EB',        // Electric Blue (Focus point)
      border: '#E4E4E7',
    },
    dark: {
      primary: '#FFFFFF',       // White
      secondary: '#27272A',     // Dark Gray
      background: '#000000',    // Pure Black (OLED Friendly)
      surface: '#18181B',       // Near Black
      text: '#FFFFFF',          // White
      textSecondary: '#A1A1AA', // Light Gray
      accent: '#3B82F6',        // Bright Blue
      border: '#27272A',
    },
  },
};