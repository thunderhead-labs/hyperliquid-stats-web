'use client';
import React from 'react';
import { Container, Box, Text, Grid, Flex } from '@chakra-ui/react';
import * as S from './styles';
import TopStats from '../charts/top-stats';
import VolumeChart from '../charts/volume';
import VolumeNumTrades from '../charts/volume-num-trades';
import OpenInterestChart from '../charts/open-interest';
import TradersProfitLossChart from '../charts/trader-profit';
import HLPProfitLossChart from '../charts/hlp-liquidator-profit';
import { DateRangeSelect } from '../charts/date-range';
import FundingRateChart from '../charts/funding-rate';
import CumulativeUsersChart from '../charts/cumulative-users';
import CoinTradesByUsers from '../charts/unique-users-coin';
import CumulativeInflowChart from '../charts/cumulative-inflow';
import CumulativeNotionalLiquidatedChart from '../charts/cumulative-notional-liquidated';
import TableLargestUsers from '../tables/largest-users';
import TableUserDesposits from '../tables/user-deposits';
import TableLiquidatedNotional from '../tables/liquidated-notional-user';
import TableTradeCount from '../tables/user-trade-count';
import Liquidity from '../charts/liquidity';
import Fees from '../charts/fees';

const Main = () => {
  return (
    <Container
      maxWidth='100%'
      my='0'
      position='relative'
      zIndex='2'
      mt='2rem'
      mb='2rem'
      p={{ xs: 0, md: '1rem' }}
    >
      <Box
        width='100%'
        height='220px'
        background='url(img/background-circles.svg) center -100px / auto no-repeat'
        display='flex'
        alignItems='center'
      >
        <Box display='flex' w='100%' justifyContent='center' alignContent='center'>
          <Text
            textAlign='center'
            fontSize='3.8rem'
            lineHeight='3.6rem'
            color='#000'
            display='flex'
            fontFamily='Teodor'
            fontWeight='500'
          >
            Hyperliquid Stats
          </Text>
        </Box>
      </Box>
      <Box
        position='relative'
        width='100%'
        p={{ xs: 0, md: '1rem' }}
        bg='#02231e'
        borderRadius='35px'
        minHeight='3000px'
      >
        <Flex
          position='relative'
          width='100%'
          px='3'
          zIndex='11'
          pt={{ xs: '1rem', md: 0 }}
          justifyContent='center'
        >
          <DateRangeSelect />
        </Flex>
        <Box position='relative' width='100%' px={{ xs: '0', md: '3' }} zIndex='9'>
          <Box width={{ xs: '100%', md: '100%' }} mt='3' p={{ xs: '2', md: '0 0 0 0' }}>
            <TopStats />
          </Box>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <VolumeChart />
            <VolumeNumTrades />
          </Grid>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <CumulativeUsersChart />
            <CoinTradesByUsers />
          </Grid>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <TradersProfitLossChart />
            <HLPProfitLossChart />
          </Grid>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <CumulativeInflowChart />
            <CumulativeNotionalLiquidatedChart />
          </Grid>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <OpenInterestChart />
            <Liquidity />
          </Grid>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(1, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <FundingRateChart />
          </Grid>
          <Fees />
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <TableLargestUsers />
            <TableUserDesposits />
          </Grid>
          <Grid templateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={{ xs: '2', md: '3' }}>
            <TableLiquidatedNotional />
            <TableTradeCount />
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Main;
