import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { useEffect, useState } from 'react';
import { Box, Text, useMediaQuery } from '@chakra-ui/react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper, { CoinSelector } from '../../common/chartWrapper';
import { BRIGHT_GREEN, CHART_HEIGHT, GREEN, YAXIS_WIDTH } from '../../../constants';
import {
  xAxisFormatter,
  yaxisFormatter,
  tooltipFormatterCurrency,
  tooltipFormatterDate,
} from '../../../helpers';

import { getTokenColor, initialTokensSelectedWithOther } from '../../../constants/tokens';
import { open_interest } from '../../../constants/api';
import { createCoinSelectors } from '@/helpers/utils';

const REQUESTS = [open_interest];

export default function OpenInterestChart() {
  const [coins, setCoins] = useState<any[]>([]);
  const [coinsSelected, setCoinsSelected] = useState<string[]>(initialTokensSelectedWithOther);

  const [formattedData, setFormattedData] = useState<any[]>([]);
  const [dataOpenInterest, loadingOpenInterest, errorOpenInterest] = useRequest(
    REQUESTS[0],
    [],
    'chart_data'
  );

  const loading = loadingOpenInterest;
  const error = errorOpenInterest;

  type OpenInterestData = { time: string; coin: string; open_interest: number };
  type GroupedOpenInterestData = {
    time: Date;
    unit: string;
    all: number;
    [key: string]: number | Date | string;
  };

  const groupByTime = (data: OpenInterestData[]): [GroupedOpenInterestData[], string[]] => {
    const map = new Map<string, any>();
    const totalOpenInterestMap = new Map<string, number>();
    const uniqueCoins = new Set<string>();

    data.forEach((item) => {
      const key = item.time;
      if (!map.has(key)) {
        map.set(key, {
          time: new Date(key),
          all: 0,
          unit: '$',
        });
      }
      const existingEntry = map.get(key);
      existingEntry[item.coin] = (existingEntry[item.coin] || 0) + item.open_interest;
      existingEntry.all += item.open_interest;

      totalOpenInterestMap.set(
        item.coin,
        (totalOpenInterestMap.get(item.coin) || 0) + item.open_interest
      );
    });

    map.forEach((entry) => {
      const coinEntries = Object.entries(entry).filter(
        ([key]) =>
          key !== 'time' &&
          key !== 'total' &&
          key !== 'cumulative' &&
          key !== 'other' &&
          key !== 'unit' &&
          key !== 'Other' &&
          key !== 'all'
      );
      coinEntries.forEach(([coin]) => uniqueCoins.add(coin));
    });
    const result = Array.from(map.values());
    return [result, Array.from(uniqueCoins)];
  };

  const formatData = () => {
    const [groupedData, coins] = groupByTime(dataOpenInterest);
    setCoins(coins);
    setFormattedData(groupedData);
  };

  useEffect(() => {
    if (!loading && !error) {
      formatData();
    }
  }, [loading]);

  const coinSelectors = createCoinSelectors(
    coins,
    coinsSelected,
    setCoinsSelected,
    formatData,
    true
  );

  return (
    <ChartWrapper title='Open Interest' loading={loading} coinSelectors={coinSelectors}>
      <ResponsiveContainer width='99%' height={CHART_HEIGHT}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray='15 15' opacity={0.1} />
          <XAxis
            dataKey='time'
            tickFormatter={xAxisFormatter}
            minTickGap={30}
            tick={{ fill: '#f9f9f9' }}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={yaxisFormatter}
            domain={[0, 'all']}
            width={YAXIS_WIDTH}
            tick={{ fill: '#f9f9f9' }}
            dx={6}
          />
          <Tooltip
            formatter={tooltipFormatterCurrency}
            labelFormatter={tooltipFormatterDate}
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
              return Number(item.value) * -1;
            }}
          />
          <Legend wrapperStyle={{ bottom: -5 }} />
          {coinsSelected.map((coinName, i) => {
            return (
              <Line
                unit={''}
                isAnimationActive={false}
                dataKey={coinName}
                dot={false}
                name={coinName.toString()}
                stroke={getTokenColor(coinName.toString())}
                key={'open-i-rate-line-' + i}
              />
            );
          })}
          <Line
            unit={''}
            isAnimationActive={false}
            dataKey={'all'}
            dot={false}
            name={'Total open interest'}
            stroke={BRIGHT_GREEN}
            key={'total-open-interest'}
          />
        </LineChart>
      </ResponsiveContainer>
      <Box w='100%' mt='3'>
        <Text color='#bbb'>
          Top 10 Coins grouped by total volume over time and remaining coins grouped by Other
        </Text>
      </Box>
    </ChartWrapper>
  );
}
