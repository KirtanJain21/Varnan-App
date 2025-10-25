export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    semibold: string;
    medium: string;
    extrabold: string;
    bold: string;
    regular: string;
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    full: number;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#1E90FF',      // Dodger Blue
    secondary: '#FF6B6B',    // Coral Red
    background: '#F4F4F4',   // Light Gray
    surface: '#FFFFFF',      // White
    text: '#1A1A1A',         // Dark Gray
    muted: '#6C757D',        // Muted Text
    border: '#E0E0E0',       // Light Border
    success: '#28A745',      // Green
    warning: '#FFC107',      // Amber
    error: '#DC3545',        // Red
  },

  fonts: {
    semibold: '600',
    medium: '500',
    extrabold: '800',
    bold: '700',  
    regular: '400',

    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
  },

  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    full: 9999,
  },
};

export default theme;
