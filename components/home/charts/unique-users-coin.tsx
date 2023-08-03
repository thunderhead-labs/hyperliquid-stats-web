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
} from 'recharts';
import { useEffect, useState } from 'react';
import { Box, Text, useMediaQuery } from '@chakra-ui/react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper from '../../common/chartWrapper';
import { CHART_HEIGHT, YAXIS_WIDTH, BRIGHT_GREEN } from '../../../constants';
import {
  tooltipFormatter,
  tooltipLabelFormatter,
  xAxisFormatter,
  yaxisFormatterNumber,
  yaxisFormatterPercent,
} from '../../../helpers';
import { getTokenHex } from '../../../constants/tokens';
import {
  cumulative_new_users,
  daily_unique_users,
  daily_unique_users_by_coin,
} from '../../../constants/api';

type DailyUniqueUsersByCoin = {
  time: string;
  coin: string;
  daily_unique_users: number;
  percentage_of_total_users: number;
  all: number;
};

type UniqueUserTradeData = {
  time: string;
  daily_unique_users: number;
};

type CumulativeNewUsersData = {
  time: string;
  daily_new_users: number;
  cumulative_new_users: number;
};

type GroupedTradeData = {
  time: Date;
  daily_unique_users: number;
  cumulative_unique_users: number;
  unit: string;
  [key: string]: number | Date | { [key: string]: number } | string | undefined;
};

type TempGroupedTradeData = {
  time: Date;
  coins: { [key: string]: number };
  //all: number;
  daily_unique_users: number;
  cumulative_unique_users: number;
  unit: string;
  [key: string]: number | Date | { [key: string]: number } | string | undefined;
};

const REQUESTS = [cumulative_new_users, daily_unique_users, daily_unique_users_by_coin];

export default function UniqueUsers() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const [formattedData, setFormattedData] = useState<any[]>([]);
  const [coinKeys, setCoinKeys] = useState<any[]>([]);

  const [dataCumulativeNewUsers, loadingCumulativeNewUsers, errorCumulativeNewUsers] = useRequest(
    REQUESTS[0],
    [],
    'chart_data'
  );
  const [dataDailyUniqueUsers, loadingDailyUniqueUsers, errorDailyUniqueUsers] = useRequest(
    REQUESTS[1],
    [],
    'chart_data'
  );
  const [dataDailyUniqueUsersByCoin, loadingDailyUniqueUsersByCoin, errorDailyUniqueUsersByCoin] =
    useRequest(REQUESTS[2], [], 'chart_data');

  const loading =
    loadingCumulativeNewUsers || loadingDailyUniqueUsers || loadingDailyUniqueUsersByCoin;
  const error = errorCumulativeNewUsers || errorDailyUniqueUsers || errorDailyUniqueUsersByCoin;

  const formatTradesByCoinAndTime = (
    dataDailyUniqueUsersByCoin: DailyUniqueUsersByCoin[],
    uniqueUserTradeData: UniqueUserTradeData[],
    dataCumulativeNewUsers: CumulativeNewUsersData[]
  ): GroupedTradeData[] => {
    const temp: { [key: string]: TempGroupedTradeData } = {};
    const uniqueUserTradeDataMap: { [key: string]: number } = {};
    const cumulativeUniqueUserTradeDataMap: { [key: string]: number } = {};

    uniqueUserTradeData.forEach((item) => {
      uniqueUserTradeDataMap[item.time] = item.daily_unique_users;
    });

    dataCumulativeNewUsers.forEach((item) => {
      cumulativeUniqueUserTradeDataMap[item.time] = item.cumulative_new_users;
    });

    dataDailyUniqueUsersByCoin.forEach(
      ({ time, coin, daily_unique_users, percentage_of_total_users }) => {
        if (!temp[time]) {
          temp[time] = {
            time: new Date(time),
            coins: {},
            daily_unique_users: uniqueUserTradeDataMap[time] || 0,
            cumulative_unique_users: cumulativeUniqueUserTradeDataMap[time] || 0,
            unit: '%',
          };
        }
        temp[time].coins[coin] = (temp[time].coins[coin] || 0) + percentage_of_total_users * 100;
        temp[time][`${coin}_daily_unique_users`] = daily_unique_users;
      }
    );

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

    return Object.values(temp).map(({ time, coins, ...rest }) => {
      return {
        time: new Date(time),
        ...sortAndSliceTop10(coins),
        ...rest,
        unit: '%',
      };
    });
  };

  const extractUniqueCoins = (formattedVolumeData: GroupedTradeData[]): string[] => {
    const coinSet = new Set<string>();
    for (const data of formattedVolumeData) {
      Object.keys(data).forEach((coin) => {
        if (
          coin !== 'all' &&
          coin !== 'cumulative' &&
          coin !== 'time' &&
          coin !== 'other' &&
          coin !== 'unit' &&
          coin !== 'daily_unique_users' &&
          coin !== 'cumulative_unique_users' &&
          !coin.includes('daily_unique_users')
        ) {
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
    const formattedData = formatTradesByCoinAndTime(
      dataDailyUniqueUsersByCoin,
      dataDailyUniqueUsers,
      dataCumulativeNewUsers
    );
    const formattedUniqueCoinKeys = extractUniqueCoins(formattedData);
    setFormattedData(formattedData);
    setCoinKeys(formattedUniqueCoinKeys);
  };

  useEffect(() => {
    if (!loading && !error) {
      formatData();
    }
  }, [loading]);

  return (
    <ChartWrapper
      title='Unique Users Percentage By Coin'
      loading={loading}
      data={formattedData}
      zIndex={8}
    >
      <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
        <ComposedChart data={formattedData}>
          <CartesianGrid strokeDasharray='15 15' opacity={0.1} />
          <XAxis
            dataKey='time'
            tickFormatter={xAxisFormatter}
            minTickGap={30}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 'auto']}
            interval='preserveStartEnd'
            tickCount={undefined}
            tickFormatter={yaxisFormatterPercent}
            width={55}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
          />
          <YAxis
            dataKey='daily_unique_users'
            orientation='right'
            yAxisId='right'
            tickFormatter={yaxisFormatterNumber}
            width={YAXIS_WIDTH}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
            contentStyle={{
              textAlign: 'left',
              background: '#0A1F1B',
              borderColor: '#061412',
              boxShadow: '0px 0px 7px rgb(0 0 0 / 20%)',
              borderRadius: '26px',
              maxHeight: '500px',
            }}
            itemSorter={(item) => {
              return Number(item.value) * -1;
            }}
          />
          <Legend wrapperStyle={{ bottom: -5 }} />
          {coinKeys.map((coinName, i) => {
            return (
              <Bar
                unit={''}
                isAnimationActive={false}
                type='monotone'
                dataKey={`${coinName}`}
                stackId='a'
                name={coinName.toString()}
                fill={getTokenHex(coinName.toString())}
                key={i}
                maxBarSize={14}
              />
            );
          })}
          <Line
            isAnimationActive={false}
            type='monotone'
            dot={false}
            strokeWidth={1}
            stroke={BRIGHT_GREEN}
            dataKey='daily_unique_users'
            yAxisId='right'
            name='Daily Unique Users'
          />
        </ComposedChart>
      </ResponsiveContainer>
      <Box w='100%' mt='3'>
        <Text color='#bbb'>
          The line is the number of unique addresses who used Hyperliquid each day, bars represent
          proportion of users who traded specific coins. Total exceeds 100% as users can trade
          multiple coins. Top 10 coins are shown separately and the rest are grouped as Other.
        </Text>
      </Box>
    </ChartWrapper>
  );
}
