import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  Cell,
  Line,
  ComposedChart,
} from 'recharts';
import { Box, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper from '../../common/chartWrapper';
import { BRIGHT_GREEN, CHART_HEIGHT, GREEN, RED } from '../../../constants';
import {
  tooltopFormatterDate,
  tooltipFormatterCurrency,
  xAxisFormatter,
  yaxisFormatterNumber,
} from '../../../helpers';
import { getTokenHex } from '@/constants/tokens';
import { asset_ctxs, hlp_liquidator_pnl, hlp_positions } from '@/constants/api';
const REQUESTS = [hlp_positions, asset_ctxs, hlp_liquidator_pnl];

export default function Hlp() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');
  const [dataMode, setDataMode] = useState<'COINS' | 'NET' | 'PNL' | 'HEDGED'>('NET');
  const [coins, setCoins] = useState<string[]>([]);
  const [dataHlpPositions, loadingDataHlpPositions, errorDataHlpPositions] = useRequest(
    REQUESTS[0],
    [],
    'chart_data'
  );
  const [assetCtxs, loadingAssetCtxs, errorAssetCtxs] = useRequest(REQUESTS[1], [], 'chart_data');
  const [dataHlpPnL, loadingHlpLiquidatorPNL, errorHlpLiquidatorPNL] = useRequest(
    REQUESTS[2],
    [],
    'chart_data'
  );
  const [ethOraclePxs, setEthOraclePxs] = useState<Map<string, number>>(new Map());
  const [hlpPnL, setHlpPnL] = useState<Map<string, HlpPnl>>(new Map());
  const [formattedHlpPnL, setFormattedHlpPnL] = useState<HlpPnl[]>([]);
  const [formattedData, setFormattedData] = useState<GroupedData[]>([]);

  const loading = loadingAssetCtxs | loadingDataHlpPositions | loadingHlpLiquidatorPNL;
  const error = errorAssetCtxs | errorDataHlpPositions | errorHlpLiquidatorPNL;

  type HlpPosition = {
    time: string;
    coin: string;
    daily_ntl: number;
    daily_ntl_abs: number;
  };

  type AssetCtx = {
    time: string;
    coin: string;
    avg_oracle_px: number;
    avg_open_interest: number;
  };

  type HlpPnl = {
    time: Date;
    pnl: number;
    cumulativePnl: number;
  };

  type GroupedData = {
    time: Date;
    daily_ntl: number;
    [coin: string]: any;
    hedged_pnl: number;
  };

  const getEthOraclePxs = (assetCtxs: AssetCtx[]): Map<string, number> => {
    const map = new Map<string, number>();
    assetCtxs.forEach((item) => {
      if (item.coin === 'ETH') {
        map.set(item.time, item.avg_oracle_px);
      }
    });
    return map;
  };

  const makeHlpPnl = (
    dataHlpPnL: {
      time: string;
      total_pnl: number;
    }[]
  ): Map<string, HlpPnl> => {
    const map = new Map<string, HlpPnl>();
    let cumulativePnl = 0;
    dataHlpPnL.forEach((item) => {
      cumulativePnl += item.total_pnl;
      map.set(item.time, {
        time: new Date(item.time),
        pnl: item.total_pnl,
        cumulativePnl,
      });
    });
    return map;
  };

  const makeFormattedData = (hlpPositions: HlpPosition[]): [GroupedData[], string[]] => {
    const map = new Map<string, GroupedData>();
    const uniqueTopCoins = new Set<string>();

    let ethOraclePxPrev: number | null | undefined = null;
    let prevTime: string | null = null;
    hlpPositions.forEach((item: HlpPosition) => {
      let { time, coin, daily_ntl } = item;
      if (!map.has(time)) {
        const pnl = hlpPnL.get(time)?.pnl;
        const ethOraclePx = ethOraclePxs.get(time);
        let hedgedPnl = pnl ?? 0;
        let prevDayNtlPosition = prevTime ? map.get(prevTime)?.daily_ntl : null;
        if (ethOraclePxPrev && ethOraclePx && prevDayNtlPosition) {
          const ethPxChange = 1 - ethOraclePxPrev / ethOraclePx;
          const ethPnL = prevDayNtlPosition * ethPxChange;
          hedgedPnl += ethPnL;
        }
        map.set(time, {
          time: new Date(time),
          daily_ntl: daily_ntl,
          [`${coin}`]: daily_ntl,
          hedged_pnl: hedgedPnl,
          Other: 0,
        });
        ethOraclePxPrev = ethOraclePx;
        prevTime = time;
      } else {
        const existingEntry = map.get(time)!;
        existingEntry[`${coin}`] = (existingEntry[`${coin}`] || 0) + daily_ntl;
        existingEntry.daily_ntl += daily_ntl;
      }
    });

    map.forEach((entry) => {
      const coinEntries = Object.entries(entry).filter(
        ([key]) => key !== 'time' && key !== 'daily_ntl' && key !== 'hedged_pnl' && key !== 'other'
      );
      const sortedCoinEntries = coinEntries.sort(
        (a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1]))
      );
      const topCoins = sortedCoinEntries.slice(0, 10).map(([coin]) => coin);
      const otherCoins = sortedCoinEntries.slice(10);

      topCoins.forEach((coin) => uniqueTopCoins.add(coin));

      let otherTotal = 0;
      otherCoins.forEach(([coin, value]) => {
        otherTotal += value;
        delete entry[coin];
      });
      entry.Other = otherTotal;
    });

    const result = Array.from(map.values());
    uniqueTopCoins.add('Other');
    return [result, Array.from(uniqueTopCoins)];
  };

  const controls = {
    toggles: [
      {
        text: 'Net notional position',
        event: () => setDataMode('NET'),
        active: dataMode === 'NET',
      },
      {
        text: 'By coins',
        event: () => setDataMode('COINS'),
        active: dataMode === 'COINS',
      },
      {
        text: 'Net PnL',
        event: () => setDataMode('PNL'),
        active: dataMode === 'PNL',
      },
      {
        text: 'Hedged PnL',
        event: () => setDataMode('HEDGED'),
        active: dataMode === 'HEDGED',
      },
    ],
  };

  const formatData = () => {
    if (dataHlpPositions && assetCtxs && dataHlpPnL) {
      const newEthOraclePxs = getEthOraclePxs(assetCtxs);
      setEthOraclePxs(newEthOraclePxs);
      const newHlpPnL = makeHlpPnl(dataHlpPnL);
      setFormattedHlpPnL(Array.from(newHlpPnL.values()));
      setHlpPnL(newHlpPnL);
      const [groupedData, coins] = makeFormattedData(dataHlpPositions);
      setCoins(coins);
      setFormattedData(groupedData);
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      formatData();
    }
  }, [loading, error, hlpPnL]);

  return (
    <ChartWrapper title='HLP Exposure' loading={false} data={formattedData} controls={controls}>
      <ResponsiveContainer width='100%' height={CHART_HEIGHT + 125}>
        <ComposedChart data={dataMode === 'PNL' ? formattedHlpPnL : formattedData}>
          <CartesianGrid strokeDasharray='15 15' opacity={0.1} />
          <XAxis
            dataKey='time'
            tickFormatter={xAxisFormatter}
            minTickGap={30}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
            tickMargin={10}
          />
          <YAxis
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
            dx={6}
            width={75}
            tickFormatter={yaxisFormatterNumber}
          />
          <Tooltip
            formatter={tooltipFormatterCurrency}
            labelFormatter={tooltopFormatterDate}
            contentStyle={{
              textAlign: 'left',
              background: '#0A1F1B',
              borderColor: '#061412',
              color: '#fff',
              boxShadow: '0px 0px 7px rgb(0 0 0 / 20%)',
              borderRadius: '26px',
              maxHeight: '500px',
            }}
            cursor={{ fill: '#0A1F1B' }}
            itemSorter={(item) => {
              return Math.abs(Number(item.value)) * -1;
            }}
          />
          {dataMode === 'NET' && (
            <Bar
              isAnimationActive={false}
              type='monotone'
              dataKey={'daily_ntl'}
              name={'Daily net notional position'}
              fill={'#fff'}
              maxBarSize={20}
            >
              {(formattedData || []).map((item: GroupedData, i: number) => {
                return <Cell key={`cell-${i}`} fill={item.daily_ntl > 0 ? GREEN : RED} />;
              })}
            </Bar>
          )}
          {dataMode === 'COINS' &&
            coins.map((coin, i) => {
              return (
                <Bar
                  unit={''}
                  isAnimationActive={false}
                  type='monotone'
                  dataKey={coin}
                  stackId='a'
                  name={coin.toString()}
                  fill={getTokenHex(coin.toString())}
                  key={i}
                  maxBarSize={20}
                />
              );
            })}
          {dataMode === 'HEDGED' && (
            <Bar
              isAnimationActive={false}
              type='monotone'
              dataKey={'hedged_pnl'}
              name={'Daily hedged PnL'}
              fill={'#fff'}
              maxBarSize={20}
            >
              {(formattedData || []).map((item: GroupedData, i: number) => {
                return <Cell key={`cell-${i}`} fill={item.hedged_pnl > 0 ? GREEN : RED} />;
              })}
            </Bar>
          )}
          {dataMode === 'PNL' && (
            <>
              <Line
                type='monotone'
                strokeWidth={1}
                stroke={BRIGHT_GREEN}
                dataKey='cumulativePnl'
                name='Cumulative PnL'
              />
              <Bar
                isAnimationActive={false}
                type='monotone'
                dataKey={'pnl'}
                name={'Net PnL'}
                fill={'#fff'}
                maxBarSize={20}
              >
                {formattedHlpPnL.map((item: HlpPnl, i: number) => {
                  return <Cell key={`cell-${i}`} fill={item.pnl > 0 ? GREEN : RED} />;
                })}
              </Bar>
            </>
          )}
          <Legend wrapperStyle={{ bottom: -5 }} />
        </ComposedChart>
      </ResponsiveContainer>
      <Box w='100%' mt='3'>
        {dataMode === 'COINS' && (
          <Text color='#bbb'>Top 10 Coins grouped daily and remaining coins grouped by Other</Text>
        )}
      </Box>
    </ChartWrapper>
  );
}
