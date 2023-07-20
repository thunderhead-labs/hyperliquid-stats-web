import { css } from '@emotion/react';
import customTheme from './theme';
import custom from './custom';
import Fonts from './fonts';

export const GlobalStyles = css`
  ${Fonts};

  body,
  html {
    margin: 0;
    padding: 0;
    color: #fff;
    background: #eee;
    font-family: 'Inter', sans-serif;
  }

  body {
    min-height: 100vh;
  }

  #__next {
    width: 100%;
    min-height: 100vh;
  }

  a {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  p a {
    font-weight: 600;
    color: ${customTheme.colors.brand[500]};
  }

  ${custom}
`;
