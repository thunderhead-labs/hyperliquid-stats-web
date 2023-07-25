import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts';
import { useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper, { CoinSelector } from '../../common/chartWrapper';
import { CHART_HEIGHT } from '../../../constants';
import {
  tooltipFormatter,
  xAxisFormatter,
  formatterPercent,
  yaxisFormatterNumber,
} from '../../../helpers';
import { getTokenHex } from '../../../constants/tokens';

export default function Hlp() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');
  const [dataMode, setDataMode] = useState<'ABS' | 'TOT'>('ABS');
  const data = [
    {
      time: '2023-07-22',
      coin: 'AAVE',
      daily_ntl: -24695.366739895835,
      daily_ntl_abs: 24695.366739895835,
    },
    { time: '2023-07-22', coin: 'APE', daily_ntl: 6690.565926875, daily_ntl_abs: 26976.979054375 },
    {
      time: '2023-07-22',
      coin: 'APT',
      daily_ntl: 7088.425567979167,
      daily_ntl_abs: 7088.425567979167,
    },
    {
      time: '2023-07-22',
      coin: 'ARB',
      daily_ntl: -142961.36674208334,
      daily_ntl_abs: 142961.36674208334,
    },
    {
      time: '2023-07-22',
      coin: 'ATOM',
      daily_ntl: -7821.417644645833,
      daily_ntl_abs: 7821.417644645833,
    },
    {
      time: '2023-07-22',
      coin: 'AVAX',
      daily_ntl: -22351.27923729167,
      daily_ntl_abs: 22351.27923729167,
    },
    {
      time: '2023-07-22',
      coin: 'BCH',
      daily_ntl: 10347.261835208334,
      daily_ntl_abs: 10347.261835208334,
    },
    {
      time: '2023-07-22',
      coin: 'BNB',
      daily_ntl: -2153.6072121875,
      daily_ntl_abs: 2153.6072121875,
    },
    {
      time: '2023-07-22',
      coin: 'BTC',
      daily_ntl: -159247.96129229167,
      daily_ntl_abs: 159247.96129229167,
    },
    {
      time: '2023-07-22',
      coin: 'CFX',
      daily_ntl: 29395.995763541665,
      daily_ntl_abs: 29395.995763541665,
    },
    {
      time: '2023-07-22',
      coin: 'COMP',
      daily_ntl: -138.10779104166667,
      daily_ntl_abs: 138.10779104166667,
    },
    {
      time: '2023-07-22',
      coin: 'CRV',
      daily_ntl: -68507.67506479166,
      daily_ntl_abs: 68507.67506479166,
    },
    {
      time: '2023-07-22',
      coin: 'DOGE',
      daily_ntl: -20193.003531895833,
      daily_ntl_abs: 20193.003531895833,
    },
    {
      time: '2023-07-22',
      coin: 'DYDX',
      daily_ntl: -28616.082704375,
      daily_ntl_abs: 28616.082704375,
    },
    {
      time: '2023-07-22',
      coin: 'ETH',
      daily_ntl: -101322.3473540625,
      daily_ntl_abs: 101322.3473540625,
    },
    {
      time: '2023-07-22',
      coin: 'FTM',
      daily_ntl: 25041.94942854167,
      daily_ntl_abs: 25041.94942854167,
    },
    {
      time: '2023-07-22',
      coin: 'GMX',
      daily_ntl: -45063.863167812495,
      daily_ntl_abs: 45063.863167812495,
    },
    {
      time: '2023-07-22',
      coin: 'INJ',
      daily_ntl: -11738.433360625,
      daily_ntl_abs: 12585.570327291667,
    },
    { time: '2023-07-22', coin: 'LDO', daily_ntl: -17352.982525, daily_ntl_abs: 17352.982525 },
    {
      time: '2023-07-22',
      coin: 'LINK',
      daily_ntl: -91954.93760666666,
      daily_ntl_abs: 91954.93760666666,
    },
    {
      time: '2023-07-22',
      coin: 'LTC',
      daily_ntl: -39076.99567708333,
      daily_ntl_abs: 39076.99567708333,
    },
    {
      time: '2023-07-22',
      coin: 'MATIC',
      daily_ntl: -13557.929645395832,
      daily_ntl_abs: 13557.929645395832,
    },
    {
      time: '2023-07-22',
      coin: 'MKR',
      daily_ntl: -58675.152068125,
      daily_ntl_abs: 58675.152068125,
    },
    { time: '2023-07-22', coin: 'OP', daily_ntl: -147964.66079, daily_ntl_abs: 147964.66079 },
    {
      time: '2023-07-22',
      coin: 'RNDR',
      daily_ntl: -59326.29024322917,
      daily_ntl_abs: 59326.29024322917,
    },
    {
      time: '2023-07-22',
      coin: 'SNX',
      daily_ntl: -39757.906322500006,
      daily_ntl_abs: 39757.906322500006,
    },
    {
      time: '2023-07-22',
      coin: 'SOL',
      daily_ntl: -144743.25938520834,
      daily_ntl_abs: 144743.25938520834,
    },
    {
      time: '2023-07-22',
      coin: 'STX',
      daily_ntl: -11695.013407864584,
      daily_ntl_abs: 11695.013407864584,
    },
    {
      time: '2023-07-22',
      coin: 'SUI',
      daily_ntl: -17981.327026447918,
      daily_ntl_abs: 17981.327026447918,
    },
    {
      time: '2023-07-22',
      coin: 'XRP',
      daily_ntl: -63650.92103635417,
      daily_ntl_abs: 63650.92103635417,
    },
    {
      time: '2023-07-22',
      coin: 'kPEPE',
      daily_ntl: -13738.879625760417,
      daily_ntl_abs: 13738.879625760417,
    },
    {
      time: '2023-07-23',
      coin: 'AAVE',
      daily_ntl: -14259.964020833335,
      daily_ntl_abs: 14259.964020833335,
    },
    {
      time: '2023-07-23',
      coin: 'APE',
      daily_ntl: 17004.951135833333,
      daily_ntl_abs: 17004.951135833333,
    },
    {
      time: '2023-07-23',
      coin: 'APT',
      daily_ntl: 7681.8976839479155,
      daily_ntl_abs: 7681.8976839479155,
    },
    {
      time: '2023-07-23',
      coin: 'ARB',
      daily_ntl: -154179.12537458332,
      daily_ntl_abs: 154179.12537458332,
    },
    {
      time: '2023-07-23',
      coin: 'ATOM',
      daily_ntl: -9580.938229041667,
      daily_ntl_abs: 9580.938229041667,
    },
    {
      time: '2023-07-23',
      coin: 'AVAX',
      daily_ntl: -47639.321636458335,
      daily_ntl_abs: 47639.321636458335,
    },
    { time: '2023-07-23', coin: 'BCH', daily_ntl: 20356.759981875, daily_ntl_abs: 20356.759981875 },
    { time: '2023-07-23', coin: 'BNB', daily_ntl: -5229.61291, daily_ntl_abs: 5229.61291 },
    {
      time: '2023-07-23',
      coin: 'BTC',
      daily_ntl: -22626.143271979163,
      daily_ntl_abs: 84629.97167697917,
    },
    { time: '2023-07-23', coin: 'CFX', daily_ntl: 28637.50690625, daily_ntl_abs: 28637.50690625 },
    {
      time: '2023-07-23',
      coin: 'COMP',
      daily_ntl: -1924.626443958333,
      daily_ntl_abs: 1924.626443958333,
    },
    {
      time: '2023-07-23',
      coin: 'CRV',
      daily_ntl: -90672.91292661459,
      daily_ntl_abs: 90672.91292661459,
    },
    {
      time: '2023-07-23',
      coin: 'DOGE',
      daily_ntl: -16449.22405945833,
      daily_ntl_abs: 16449.22405945833,
    },
    {
      time: '2023-07-23',
      coin: 'DYDX',
      daily_ntl: -39471.316518541666,
      daily_ntl_abs: 39471.316518541666,
    },
    {
      time: '2023-07-23',
      coin: 'ETH',
      daily_ntl: -67696.736454375,
      daily_ntl_abs: 69032.29530416666,
    },
    { time: '2023-07-23', coin: 'FTM', daily_ntl: 24698.520458125, daily_ntl_abs: 24698.520458125 },
    {
      time: '2023-07-23',
      coin: 'GMX',
      daily_ntl: -35914.022444166665,
      daily_ntl_abs: 35914.022444166665,
    },
    {
      time: '2023-07-23',
      coin: 'INJ',
      daily_ntl: -2506.552681979167,
      daily_ntl_abs: 11130.528851354167,
    },
    { time: '2023-07-23', coin: 'LDO', daily_ntl: -17352.875905, daily_ntl_abs: 17352.875905 },
    {
      time: '2023-07-23',
      coin: 'LINK',
      daily_ntl: -76143.19305677083,
      daily_ntl_abs: 76143.19305677083,
    },
    {
      time: '2023-07-23',
      coin: 'LTC',
      daily_ntl: -39612.22826541667,
      daily_ntl_abs: 39612.22826541667,
    },
    {
      time: '2023-07-23',
      coin: 'MATIC',
      daily_ntl: -12715.908532541667,
      daily_ntl_abs: 12715.908532541667,
    },
    {
      time: '2023-07-23',
      coin: 'MKR',
      daily_ntl: -71643.27720041666,
      daily_ntl_abs: 71643.27720041666,
    },
    {
      time: '2023-07-23',
      coin: 'OP',
      daily_ntl: -169959.94850562498,
      daily_ntl_abs: 169959.94850562498,
    },
    {
      time: '2023-07-23',
      coin: 'RNDR',
      daily_ntl: -52620.743885104166,
      daily_ntl_abs: 52620.743885104166,
    },
    {
      time: '2023-07-23',
      coin: 'SNX',
      daily_ntl: -37697.82067958333,
      daily_ntl_abs: 37697.82067958333,
    },
    {
      time: '2023-07-23',
      coin: 'SOL',
      daily_ntl: -155785.38252520832,
      daily_ntl_abs: 155785.38252520832,
    },
    {
      time: '2023-07-23',
      coin: 'STX',
      daily_ntl: -11593.471571635417,
      daily_ntl_abs: 11593.471571635417,
    },
    {
      time: '2023-07-23',
      coin: 'SUI',
      daily_ntl: -13438.161510718748,
      daily_ntl_abs: 13438.161510718748,
    },
    {
      time: '2023-07-23',
      coin: 'XRP',
      daily_ntl: -61726.967644062504,
      daily_ntl_abs: 61726.967644062504,
    },
    {
      time: '2023-07-23',
      coin: 'kPEPE',
      daily_ntl: -7629.018077135417,
      daily_ntl_abs: 9366.293052468749,
    },
  ];

  type HlpPosition = {
    time: string;
    coin: string;
    daily_ntl: number;
    daily_ntl_abs: number;
  };

  type HlpAbsolutePositionTotal = {
    time: Date;
    daily_ntl_abs: number;
  };

  const groupByTime = (data: HlpPosition[]): HlpAbsolutePositionTotal[] => {
    const map = new Map<string, HlpAbsolutePositionTotal>();

    data.forEach((item) => {
      let time = item.time;
      if (map.has(time)) {
        const value = map.get(time)!;
        map.set(time, {
          time: value.time,
          daily_ntl_abs: value.daily_ntl_abs + item.daily_ntl_abs,
        });
      } else {
        map.set(time, {
          time: new Date(time),
          daily_ntl_abs: item.daily_ntl_abs,
        });
      }
    });

    const result = Array.from(map.values());
    return result;
  };

  const controls = {
    toggles: [
      {
        text: 'Total absolute notional position',
        event: () => setDataMode('ABS'),
        active: dataMode === 'ABS',
      },
      {
        text: 'Total notional position',
        event: () => setDataMode('TOT'),
        active: dataMode === 'TOT',
      },
    ],
  };

  return (
    <ChartWrapper title='HLP Positions' loading={false}
        data={dataMode === 'ABS' ? groupByTime(data) : groupByTime(data)}
        controls={controls}

    >
      <ResponsiveContainer width='100%' height={CHART_HEIGHT + 125}>
        <BarChart data={groupByTime(data)}>
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
            formatter={tooltipFormatter}
            labelFormatter={() => ''}
            contentStyle={{
              textAlign: 'left',
              background: '#0A1F1B',
              borderColor: '#061412',
              color: '#fff',
              boxShadow: '0px 0px 7px rgb(0 0 0 / 20%)',
              borderRadius: '26px',
              maxHeight: '500px',
            }}
          />
          <Bar dataKey='daily_ntl_abs' fill='#8884d8' name='Daily Notional Absolute' />
          <Legend wrapperStyle={{ bottom: -5 }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
