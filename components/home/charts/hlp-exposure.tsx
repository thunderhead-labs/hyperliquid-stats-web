import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell,
} from 'recharts';
import { useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper from '../../common/chartWrapper';
import { CHART_HEIGHT, GREEN, RED } from '../../../constants';
import {
  tooltipFormatterCurrency,
  xAxisFormatter,
  yaxisFormatterNumber,
} from '../../../helpers';
import { getTokenHex } from '@/constants/tokens';
import { hlp_positions } from '@/constants/api';
const REQUESTS = [hlp_positions];

export default function Hlp() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');
  const [dataMode, setDataMode] = useState<'COINS' | 'NET'>('COINS');
  const [coins, setCoins] = useState<string[]>([]);
  const [dataHlpPositions, loading, error] = useRequest(
    REQUESTS[0],
    [],
    'chart_data'
  );
  const [formattedData, setFormattedData] = useState<GroupedData[]>([]);

  type HlpPosition = {
    time: string;
    coin: string;
    daily_ntl: number;
    daily_ntl_abs: number;
  };

  type GroupedData = {
    time: Date;
    daily_ntl: number;
    [coin: string]: any;
  };

  const makeFormattedData = (data: HlpPosition[]): [GroupedData[], string[]] => {
    const map = new Map<string, GroupedData>();
    const uniqueTopCoins = new Set<string>();
  
    data.forEach((item) => {
      let {time, coin, daily_ntl} = item;
  
      if (!map.has(time)) {
        map.set(time, {
          time: new Date(time),
          daily_ntl: daily_ntl,
          [`${coin}`]: daily_ntl,
          other: 0,
        });
      } else {
        const existingEntry = map.get(time)!;
        existingEntry[`${coin}`] = (existingEntry[`${coin}`] || 0) + daily_ntl;
        existingEntry.daily_ntl += daily_ntl;
      }
    });
  
    map.forEach((entry) => {
      const coinEntries = Object.entries(entry).filter(([key]) => key !== 'time' && key !== 'daily_ntl' && key !== 'other');
      const sortedCoinEntries = coinEntries.sort((a, b) => Math.abs(Number(b[1])) - Math.abs(Number(a[1])));
      const topCoins = sortedCoinEntries.slice(0, 10).map(([coin]) => coin);
      const otherCoins = sortedCoinEntries.slice(10);

      topCoins.forEach(coin => uniqueTopCoins.add(coin));
  
      let otherTotal = 0;
      otherCoins.forEach(([coin, value]) => {
        otherTotal += value;
        delete entry[coin];
      });
      entry.Other = otherTotal;
    });
  
    const result = Array.from(map.values());
    uniqueTopCoins.add("Other");
    return [result, Array.from(uniqueTopCoins)];
  };
  

  const controls = {
    toggles: [
      {
        text: 'Coins',
        event: () => setDataMode('COINS'),
        active: dataMode === 'COINS',
      },
      {
        text: 'Net notional position',
        event: () => setDataMode('NET'),
        active: dataMode === 'NET',
      },
    ],
  };


  const formatData = () => {
    if (dataHlpPositions) {
      const [groupeData, coins] = makeFormattedData(dataHlpPositions);
      setFormattedData(groupeData);
      setCoins(coins);
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      formatData();
    }
  }, [loading, error]);

  console.log("***", coins, formattedData);

  return (
    <ChartWrapper title='HLP Exposure' loading={false}
        data={formattedData}
        controls={controls}
    >
      <ResponsiveContainer width='100%' height={CHART_HEIGHT + 125}>
        <BarChart data={formattedData}>
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
          {
            dataMode === 'NET' &&
            (
              <Bar
              isAnimationActive={false}
              type='monotone'
              dataKey={'daily_ntl'}
              name={'Daily net notional position'}
              fill={'#fff'}
              maxBarSize={20}
            >
              {( formattedData || []).map((item: GroupedData, i: number) => {
                return <Cell key={`cell-${i}`} fill={item.daily_ntl > 0 ? GREEN : RED} />;
              })}
            </Bar>
            )
          }
          {
            dataMode === 'COINS' &&
            (
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
              })
            )
          }
          <Legend wrapperStyle={{ bottom: -5 }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
