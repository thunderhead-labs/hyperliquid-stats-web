import styled from '@emotion/styled';
import { Box, Text, Button, Icon } from '@chakra-ui/react';
import theme from '../../../styles/theme';

export const Wrapper = styled(Box)`
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 1.8rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem;
`;

export const LogoWrapper = styled(Box)`
  display: flex;
  height: 24px;
  svg {
    height: 100%;
    width: auto;
  }
`;
