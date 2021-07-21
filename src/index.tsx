import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import App from 'src/sections/app';
import { theme } from './theme';

const GlobalStyle = createGlobalStyle`
    html {
        width: 100vw;
        height: 100%;
        font-size: 62.5%;
        background: ${({ theme }) => theme.colors.black};
        color: ${({ theme }) => theme.colors.white};
        font-family: ${({ theme }) => theme.fonts.ubuntu};
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        max-width: 100%;
    }

    h1 {
        font-size: 3rem;
    }
    h2 {
        font-size: 2.75rem;
    }
    h3 {
        font-size: 2.5rem;
    }
    h4, h5, h6 {
        font-size: 2.25rem;
    }
    p, strong, a {
        font-size: 1.75rem;
    }
`;

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <App />
  </ThemeProvider>,
  document.querySelector('#root')
);
