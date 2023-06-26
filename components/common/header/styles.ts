import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';
import theme from '../../../styles/theme';

export const LogoWrapper = styled(Box)`
  position: relative;
  display: flex;
  height: 28px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 500;

  img {
    height: 100%;
    width: auto;
  }
`;

export const LogoTextWrapper = styled(Box)`
  display: flex;
  position: relative;
  left: -0.5rem;
  /* height: 24px;

  @media only screen and (max-width: ${theme.breakpoints.md}) {
    height: 18px;
  } */

  svg {
    height: 100%;
    width: auto;
  }
`;

export const FeatureImg = styled(Box)`
  display: flex;
  position: absolute;
  top: -105px;
  left: -200px;

  @media only screen and (max-width: ${theme.breakpoints.md}) {
    top: -150px;
    left: -250px;
  }
`;
