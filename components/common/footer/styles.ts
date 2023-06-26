import styled from '@emotion/styled';
import { Box, Text, Button, Icon, GridItem } from '@chakra-ui/react';
import theme from '../../../styles/theme';

export const Wrapper = styled(Box)`
  display: flex;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const LogoWrapper = styled(GridItem)`
  display: flex;
  flex-direction: column;
  width: 190px;
  padding-right: 20px;

  svg {
    display: flex;
    width: 100%;
    height: auto;
  }
`;
