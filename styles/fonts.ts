import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Box } from '@chakra-ui/react';
import customTheme from './theme';
import onboard from './custom';

export default css`
  @font-face {
    font-display: swap;
    font-family: Inter;
    font-style: normal;
    font-weight: 300;
    src:
      url(/fonts/Inter-Light.woff2) format('woff2'),
      url(/fonts/Inter-Light.woff?v=3.19) format('woff');
  }

  @font-face {
    font-display: swap;
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    src:
      url(/fonts/Inter-Regular.woff2) format('woff2'),
      url(/fonts/Inter-Regular.woff?v=3.19) format('woff');
  }

  @font-face {
    font-display: swap;
    font-family: Inter;
    font-style: normal;
    font-weight: 700;
    src:
      url(/fonts/Inter-Bold.woff2) format('woff2'),
      url(/fonts/Inter-Bold.woff?v=3.19) format('woff');
  }

  @font-face {
    font-display: swap;
    font-family: Teodor;
    font-style: normal;
    font-weight: 400;
    src:
      url(/fonts/Teodor-Light.woff) format('woff'),
      url(/fonts/Teodor-Light.woff2) format('woff2');
  }

  @font-face {
    font-display: swap;
    font-family: Teodor;
    font-style: italic;
    font-weight: 400;
    src:
      url(/fonts/Teodor-LightItalic.woff) format('woff'),
      url(/fonts/Teodor-LightItalic.woff2) format('woff2');
  }
`;
