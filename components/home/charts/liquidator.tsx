import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import { Box, Text, useMediaQuery } from '@chakra-ui/react';
import ChartWrapper from '../../common/chartWrapper';
import {
  CHART_HEIGHT,
  YAXIS_WIDTH,
  BRIGHT_GREEN,
  BRAND_GREEN_2,
  BRAND_GREEN_3,
  GREEN,
  RED,
} from '../../../constants';
import {
  tooltipLabelFormatter,
  yaxisFormatter,
  xAxisFormatter,
  tooltipFormatterCurrency,
  tooltipFormatterDate,
} from '../../../helpers';
import { getTokenHex } from '../../../constants/tokens';
import {
  cumulative_liquidated_notional,
  daily_notional_liquidated_total,
  daily_notional_liquidated_by_leverage_type,
  daily_notional_liquidated_by_coin,
  hlp_liquidator_pnl_false,
  cumulative_hlp_liquidator_pnl_false,
} from '../../../constants/api';

const REQUESTS = [
  cumulative_liquidated_notional,
  daily_notional_liquidated_total,
  daily_notional_liquidated_by_leverage_type,
  daily_notional_liquidated_by_coin,
  hlp_liquidator_pnl_false,
  cumulative_hlp_liquidator_pnl_false,
];

export default function LiquidatorChart() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const [dataMode, setDataMode] = useState<'COINS' | 'MARGIN' | 'PNL'>('COINS');
  const [formattedDataCoins, setFormattedDataCoins] = useState<any[]>([]);
  const [formattedDataMargin, setFormattedDataMargin] = useState<any[]>([]);

  const [coinKeys, setCoinKeys] = useState<any[]>([]);

  const [dataCumulativeLiquidated, loadingCumulativeLiquidated, errorCumulativeLiquidated] =
    useRequest(REQUESTS[0], [], 'chart_data');
  const [dataDailyLiquidatedTotal, loadingDailyLiquidatedTotal, errorDailyUsdVolumeTotal] =
    useRequest(REQUESTS[1], [], 'chart_data');
  const [
    dataDailyLiquidatedByMargin,
    loadingDailyLiquidatedByMargin,
    errorDailyLiquidatedByMargin,
  ] = useRequest(REQUESTS[2], [], 'chart_data');
  const [dataDailyLiquidatedByCoins, loadingDailyLiquidatedByCoins, errorDailyLiquidatedByCoins] =
    useRequest(REQUESTS[3], [], 'chart_data');
  const [dataLiquidatorPnl, loadingLiquidatorPnl, errorLiquidatorPnl] = useRequest(
    REQUESTS[4],
    [],
    'chart_data'
  );
  const [
    dataLiquidatorCumulativePnl,
    loadingLiquidatorCumulativePnl,
    errorLiquidatorCumulativePnl,
  ] = useRequest(REQUESTS[5], [], 'chart_data');
  const [formattedLiquidatorPnl, setFormattedLiquidatorPnl] = useState<LiquidatorPnl[]>([]);

  type LiquidatorPnl = {
    time: Date;
    pnl: number;
    cumulativePnl: number;
  };

  const loading =
    loadingCumulativeLiquidated ||
    loadingDailyLiquidatedTotal ||
    loadingDailyLiquidatedByMargin ||
    loadingDailyLiquidatedByCoins ||
    loadingLiquidatorPnl ||
    loadingLiquidatorCumulativePnl;
  const error =
    errorCumulativeLiquidated ||
    errorDailyUsdVolumeTotal ||
    errorDailyLiquidatedByMargin ||
    errorDailyLiquidatedByCoins ||
    errorLiquidatorPnl ||
    errorLiquidatorCumulativePnl;
  type CumulativeLiquidationData = { cumulative: number; time: string };

  const formatCumulativeLiquidatedByTime = (
    dataCumulativeLiquidated: CumulativeLiquidationData[]
  ): { [key: string]: number } => {
    const result: { [key: string]: number } = {};
    for (const data of dataCumulativeLiquidated) {
      result[data.time] = data.cumulative;
    }
    return result;
  };

  const formatLiquidatorPnl = (
    dataLiquidatorPnl: any,
    dataLiquidatorCumulativePnl: any
  ): LiquidatorPnl[] => {
    const map = new Map<string, LiquidatorPnl>();
    dataLiquidatorPnl.map((item: any) => {
      let entry = {
        time: new Date(item.time),
        pnl: item.total_pnl,
        cumulativePnl: 0,
      };
      map.set(item.time, entry);
    });

    dataLiquidatorCumulativePnl.map((item: any) => {
      let existingEntry = map.get(item.time)!;
      existingEntry.cumulativePnl = item.cumulative_pnl;
    });

    return Array.from(map.values());
  };

  type LiquidationData = {
    time: string;
    leverage_type: 'Cross' | 'Isolated';
    daily_notional_liquidated: number;
  };

  const formatLiquidatedByMargin = (
    dataDailyLiquidatedByMargin: LiquidationData[],
    formattedCumulativeLiquidatedByTime: { [key: string]: number }
  ): any[] => {
    const temp: { [key: string]: any } = {};
    for (const data of dataDailyLiquidatedByMargin) {
      if (!temp[data.time]) {
        temp[data.time] = { all: 0 };
      }
      temp[data.time][data.leverage_type] = data.daily_notional_liquidated;
      temp[data.time].all += data.daily_notional_liquidated;
    }
    const result: any[] = Object.entries(temp).map((item: any) => {
      return {
        time: new Date(item[0]),
        crossed: item[1].hasOwnProperty('Cross') ? item[1].Cross : 0,
        isolated: item[1].hasOwnProperty('Isolated') ? item[1].Isolated : 0,
        all: item[1].all,
        cumulative: formattedCumulativeLiquidatedByTime[item[0]],
      };
    });
    return result;
  };

  type FormattedCoinTradesData = any[];

  const formatDailyTradesByCoins = (
    dataDailyTradesByCoin: { time: string; coin: string; daily_notional_liquidated: number }[],
    formattedCumulativeByTime: { [key: string]: number }
  ): FormattedCoinTradesData[] => {
    const temp: { [key: string]: { all: number; [coin: string]: number } } = {};
    for (const data of dataDailyTradesByCoin) {
      if (!temp[data.time]) {
        temp[data.time] = { all: 0 };
      }
      temp[data.time][data.coin] = data.daily_notional_liquidated;
      temp[data.time].all += data.daily_notional_liquidated;
    }

    const sortAndSliceTop10 = (obj: { [coin: string]: number }) => {
      const sortedEntries = Object.entries(obj).sort(
        ([, aVolume], [, bVolume]) => bVolume - aVolume
      );
      const top10Entries = sortedEntries.slice(0, 10);
      const otherEntries = sortedEntries.slice(10);

      const otherVolume = otherEntries.reduce((total, [, volume]) => total + volume, 0);
      return {
        ...Object.fromEntries(top10Entries),
        Other: otherVolume,
      };
    };

    const result: any[] = Object.entries(temp).map(([time, volumes]) => {
      const top10Volumes = sortAndSliceTop10(volumes);
      return {
        time: new Date(time),
        ...top10Volumes,
        cumulative: formattedCumulativeByTime[time as any],
        unit: '',
      };
    });
    return result;
  };

  const extractUniqueCoins = (formattedData: any[]): string[] => {
    const coinSet = new Set<string>();
    for (const data of formattedData) {
      Object.keys(data).forEach((coin) => {
        if (coin !== 'time' && coin !== 'unit' && coin !== 'cumulative' && coin !== 'all') {
          coinSet.add(coin);
        }
      });
    }
    const coinsArray = Array.from(coinSet);
    if (coinsArray.includes('Other')) {
      const index = coinsArray.indexOf('Other');
      coinsArray.splice(index, 1);
      coinsArray.push('Other');
    }
    return coinsArray;
  };

  const formatData = () => {
    const formattedCumulativeLiquidatedByTime =
      formatCumulativeLiquidatedByTime(dataCumulativeLiquidated);
    const formattedVolumeByMargin = formatLiquidatedByMargin(
      dataDailyLiquidatedByMargin,
      formattedCumulativeLiquidatedByTime
    );
    const formattedDailyTradesByCoins = formatDailyTradesByCoins(
      dataDailyLiquidatedByCoins,
      formattedCumulativeLiquidatedByTime
    );
    const newFormattedLiquidatorPnl = formatLiquidatorPnl(
      dataLiquidatorPnl,
      dataLiquidatorCumulativePnl
    );
    setFormattedLiquidatorPnl(newFormattedLiquidatorPnl);
    setCoinKeys(extractUniqueCoins(formattedDailyTradesByCoins));
    setFormattedDataMargin(formattedVolumeByMargin);
    setFormattedDataCoins(formattedDailyTradesByCoins);
    console.log('dev formattedDailyTradesByCoins', formattedDailyTradesByCoins);
  };

  const controls = {
    toggles: [
      {
        text: 'By coin',
        event: () => setDataMode('COINS'),
        active: dataMode === 'COINS',
      },
      {
        text: 'By margin type',
        event: () => setDataMode('MARGIN'),
        active: dataMode === 'MARGIN',
      },
      {
        text: 'Liquidator PnL',
        event: () => setDataMode('PNL'),
        active: dataMode === 'PNL',
      },
    ],
  };

  useEffect(() => {
    if (!loading && !error) {
      formatData();
    }
  }, [loading, error]);

  const dataModeToData = (dataMode: string) => {
    switch (dataMode) {
      case 'COINS':
        return formattedDataCoins;
      case 'MARGIN':
        return formattedDataMargin;
      case 'PNL':
        return formattedLiquidatorPnl;
    }
  };

  const pnlYDomain = () => {
    let maxPnl = formattedLiquidatorPnl.reduce((max, curr) => {
      return Math.abs(max.pnl) > Math.abs(curr.pnl) ? max : curr;
    }).pnl;
    return [-1 * Math.abs(maxPnl) * 1.1, Math.abs(maxPnl) * 1.1];
  };

  const cumulativePnlYDomain = () => {
    let maxCumulativePnl = formattedLiquidatorPnl.reduce((max, curr) => {
      return Math.abs(max.cumulativePnl) > Math.abs(curr.cumulativePnl) ? max : curr;
    }).cumulativePnl;

    return [-1 * Math.abs(maxCumulativePnl) * 1.1, Math.abs(maxCumulativePnl) * 1.1];
  };
  return (
    <ChartWrapper
      title='Liquidations'
      loading={loading}
      data={dataModeToData(dataMode)}
      controls={controls}
      zIndex={7}
    >
      <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
        <ComposedChart data={dataModeToData(dataMode)} syncId='syncA'>
          <CartesianGrid strokeDasharray='15 15' opacity={0.1} />
          <XAxis
            dataKey='time'
            tickFormatter={xAxisFormatter}
            minTickGap={30}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
            tickMargin={10}
          />
          <Tooltip
            formatter={tooltipFormatterCurrency}
            labelFormatter={dataMode === 'PNL' ? tooltipFormatterDate : tooltipLabelFormatter}
            contentStyle={{
              textAlign: 'left',
              background: '#0A1F1B',
              borderColor: '#061412',
              color: '#fff',
              boxShadow: '0px 0px 7px rgb(0 0 0 / 20%)',
              borderRadius: '26px',
              maxHeight: '500px',
            }}
            itemSorter={(item) => {
              return Math.abs(Number(item.value));
            }}
          />
          <Legend wrapperStyle={{ bottom: -5 }} />
          {dataMode === 'COINS' && (
            <>
              {coinKeys &&
                coinKeys.map((coinName, i) => {
                  return (
                    <Bar
                      unit={''}
                      isAnimationActive={false}
                      type='monotone'
                      dataKey={coinName}
                      stackId='a'
                      name={coinName.toString()}
                      fill={getTokenHex(coinName.toString())}
                      key={i}
                      maxBarSize={20}
                    />
                  );
                })}
            </>
          )}
          {dataMode === 'MARGIN' && (
            <>
              <Bar
                unit={''}
                isAnimationActive={false}
                type='monotone'
                dataKey={'crossed'}
                stackId='a'
                name={'Crossed'}
                fill={BRAND_GREEN_2}
                maxBarSize={20}
              />
              <Bar
                unit={''}
                isAnimationActive={false}
                type='monotone'
                dataKey={'isolated'}
                stackId='a'
                name={'Isolated'}
                fill={BRAND_GREEN_3}
                maxBarSize={20}
              />
            </>
          )}
          {dataMode !== 'PNL' && (
            <>
              <YAxis
                dataKey={'all'}
                interval='preserveStartEnd'
                tickCount={7}
                tickFormatter={yaxisFormatter}
                width={70}
                tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
              />
              <YAxis
                orientation='right'
                yAxisId='right'
                dataKey={'cumulative'}
                tickFormatter={yaxisFormatter}
                width={YAXIS_WIDTH}
                tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
              />
              <Line
                isAnimationActive={false}
                type='monotone'
                dot={false}
                strokeWidth={1}
                stroke={BRIGHT_GREEN}
                dataKey='cumulative'
                yAxisId='right'
                name='Cumulative'
              />
            </>
          )}
          {dataMode === 'PNL' && (
            <>
              <YAxis
                tickCount={7}
                width={70}
                tickFormatter={yaxisFormatter}
                domain={pnlYDomain()}
                tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
              />
              <YAxis
                orientation='right'
                yAxisId='right'
                tickFormatter={yaxisFormatter}
                domain={cumulativePnlYDomain()}
                width={YAXIS_WIDTH}
                tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
              />
              <Bar
                isAnimationActive={false}
                type='monotone'
                fill={'#FFF'}
                dataKey='pnl'
                name='PnL'
                maxBarSize={20}
              >
                {formattedLiquidatorPnl.map((item: any, i: number) => {
                  return <Cell key={`cell-${i}`} fill={item.pnl > 0 ? GREEN : RED} />;
                })}
              </Bar>
              <Line
                isAnimationActive={false}
                type='monotone'
                dot={false}
                strokeWidth={1}
                stroke={BRIGHT_GREEN}
                dataKey='cumulativePnl'
                name='Cumulative PnL'
                yAxisId='right'
              />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <Box w='100%' mt='3'>
        <Text color='#bbb'>Top 10 Coins grouped daily and remaining coins grouped by Other</Text>
      </Box>
    </ChartWrapper>
  );
}
