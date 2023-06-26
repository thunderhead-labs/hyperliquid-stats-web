import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Box } from '@chakra-ui/react';
import customTheme from '../../../styles/theme';

export const FeatureContainer = styled(Box)`
  display: flex;
  border-radius: 24px;
`;

export const FeatureWrap = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  min-height: 260px;
  width: 100%;
  border-radius: 24px;
  padding: 1.25rem;
  padding-top: 1.5rem;
  border: 1px solid ${customTheme.colors.gray[600]};
  background: rgba(105, 228, 225, 0.12);
  align-items: top;

  @media only screen and (min-width: ${customTheme.breakpoints.md}) {
    flex-direction: column;
  }

  &::after {
    content: '';
    height: 30px;
    width: 5px;
    background: blue;
    position: absolute;
    left: -1px;
    border-radius: 0 6px 6px 0;
    background: ${customTheme.colors.blue[500]};
  }
`;

export const Img = styled(Box)`
  position: absolute;
  left: -120px;
  top: calc(50% - 40px);
  width: 80px;

  img {
    width: 100%;
  }
`;

const fade = keyframes`
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 0.5;
  }
`;

export const Feature = styled(Box)`
  padding: 1.5rem 1.5rem;
  border-radius: 4rem;
  border: 2px solid ${customTheme.colors.blue[300]};
  display: flex;
  flex-direction: row;
`;

export const FeatureImg = styled(Box)`
  position: relative;
  width: 60px;
  margin-right: 2rem;
  margin-left: 1rem;
  margin-top: 0.5rem;

  img {
    width: 100%;
  }
`;

export const FeatureImg2 = styled(Box)`
  position: relative;
  width: 120px;
  margin-right: 2rem;
  margin-left: 1rem;

  img {
    width: 100%;
  }
`;

export const BgImg2 = styled(Box)`
  position: absolute;
  right: -75%;
  display: flex;
  width: 1400px;
  bottom: -400px;
  z-index: 0.5;
  animation: ${fade} 20s infinite;
  transition: visibility 20s ease-in-out;
  
  img {
    width: 100%;
  }
`;

export const ImgPlanet1 = styled(Box)`
  position: absolute;
  left: 0;
  top: 200px;
  display: flex;
  width: 590px;

  img {
    width: 100%;
  }
`;

export const ImgPlanet2 = styled(Box)`
  position: absolute;
  right: 0;
  bottom: 50px;
  display: flex;
  width: 590px;

  img {
    width: 100%;
  }
`;