import { createTheme } from '@mui/material/styles';
// import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    otherColor?: {
      main: string;
    };
  }
}

export const theme = createTheme({
  palette:{
    primary:{
      main: '#1760a5',
      light: 'rgba(0, 0, 0, 0)'
    },
    secondary:{
      main: '#15c630',
    },
    otherColor:{
      main:'#999'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0
        },
        'html, body, #root': {
          height: '100%'
        },
        ul: {
          listStyle: 'none'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: { verticalAlign: 'middle' }
      }
    }
  }
});
