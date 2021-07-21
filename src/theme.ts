export const theme = {
  colors: {
    black: '#423E3B',
    red: '#FF2E00',
    orange: '#FEA82F',
    white: '#FFFFEB',
    blue: '#5448C8',
  },
  breakpoints: {},
  fonts: {
    ubuntu: "'Ubuntu', sans-serif",
    roboto: "'Roboto', sans-serif",
  },
};

type ITheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}
