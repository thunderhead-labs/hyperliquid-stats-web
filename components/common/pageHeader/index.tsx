import React, { useEffect } from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import NextImg from 'next/image';
import * as S from './styles';
import * as CS from '../styles';

type PageHeaderProps = {
  title: string;
  description?: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <>
      <Container maxWidth='container.xl' position='relative' zIndex='2'>
        <Box
          width='100%'
          display='flex'
          alignItems='center'
          flexDirection='column'
          justifyContent='space-between'
          zIndex='2'
        >
          <Box display='flex' justifyContent='center' mt={{ xs: 10, md: 20 }} width='100%'>
            <Text fontSize='3rem' fontWeight='400' display='flex' color='white'>
              {title}
            </Text>
          </Box>
          <Box
            display='flex'
            justifyContent='center'
            mt={{ xs: 10, md: 5 }}
            px={{ xs: 2, md: 24 }}
            width='100%'
            textAlign='center'
          >
            {description && (
              <Text
                fontSize='1.1rem'
                fontWeight='400'
                display='flex'
                color='white'
                opacity='0.5'
                px={{ xs: 2, md: 24 }}
              >
                {description}
              </Text>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default PageHeader;
