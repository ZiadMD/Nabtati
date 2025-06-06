/**
 * Hadeeqati App Theme Configuration
 * Contains colors, typography, and spacing settings
 */

export const colors = {
  // Primary colors
  primary: '#2E7D32', // Forest Green
  secondary: '#795548', // Earthy Brown
  accent: '#A5D6A7', // Leafy Lime
  
  // Background colors
  background: {
    main: '#FAFAFA', // Off-White
    secondary: '#F5F5DC', // Soft Beige
  },
  
  // Text colors
  text: {
    primary: '#212121', // Dark Charcoal
    secondary: '#757575', // Medium Gray
    light: '#FFFFFF', // White
  },
  
  // Status colors
  success: '#4CAF50', // Green
  warning: '#FFC107', // Amber
  error: '#F44336', // Red
  info: '#2196F3', // Blue
  
  // UI element colors
  border: '#E0E0E0',
  divider: '#EEEEEE',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const typography = {
  // Font families
  fontFamily: {
    heading: 'Poppins-Bold', // or 'Roboto-Bold'
    body: 'OpenSans-Regular',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Export default theme object
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;