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
import { useRequest } from '@/hooks/useRequest';
import { useMediaQuery } from '@chakra-ui/react';
import ChartWrapper from '../../common/chartWrapper';
import { CHART_HEIGHT, YAXIS_WIDTH, BRIGHT_GREEN } from '../../../constants';
import { yaxisFormatter, xAxisFormatter, tooltipFormatterCurrency } from '../../../helpers';
import { total_accrued_fees } from '../../../constants/api';

const REQUESTS = [total_accrued_fees];

export default function Fees() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const [dailyFeesAccrued, setDailyFeesAccrued] = useState<any[]>([]);
  const [cumulativeFeesAccrued, loading, error] = useRequest(REQUESTS[0], [], 'chart_data');

  interface DailyFeesAccrued {
    time: Date;
    daily_fees_accrued: number;
  }

  interface CumulativeFeesAccrued {
    time: Date;
    cumulative_fees_accrued: number;
  }

  const computeDailyFeesAccrued = (
    cumulativeFeesAccrued: CumulativeFeesAccrued[]
  ): DailyFeesAccrued[] => {
    const result: DailyFeesAccrued[] = [];
    for (let i = 1; i < cumulativeFeesAccrued.length; i++) {
      result.push({
        time: cumulativeFeesAccrued[i].time,
        daily_fees_accrued:
          cumulativeFeesAccrued[i].cumulative_fees_accrued -
          cumulativeFeesAccrued[i - 1].cumulative_fees_accrued,
      });
    }

    return result;
  };

  const formatData = () => {
    const newDailyFeesAccrued = computeDailyFeesAccrued(cumulativeFeesAccrued);
    setDailyFeesAccrued(newDailyFeesAccrued);
  };

  useEffect(() => {
    if (!loading && !error) {
      formatData();
    }
  }, [loading, error]);

  return (
    <ChartWrapper title='Fees Accrued' loading={loading} data={cumulativeFeesAccrued}>
      <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
        <ComposedChart data={cumulativeFeesAccrued}>
          <CartesianGrid strokeDasharray='15 15' opacity={0.1} />
          <XAxis
            dataKey='time'
            tickFormatter={xAxisFormatter}
            minTickGap={30}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
            tickMargin={10}
          />
          <YAxis
            dataKey='fees'
            interval='preserveStartEnd'
            tickCount={7}
            tickFormatter={yaxisFormatter}
            width={70}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
          />
          <YAxis
            dataKey='cumulative_fees_accrued'
            orientation='right'
            yAxisId='right'
            tickFormatter={yaxisFormatter}
            width={YAXIS_WIDTH}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
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
            itemSorter={(item) => {
              return Number(item.value) * -1;
            }}
          />
          <Legend wrapperStyle={{ bottom: -5 }} />
          <Bar
            isAnimationActive={false}
            type='monotone'
            data={dailyFeesAccrued}
            dataKey={'daily_fees_accrued'}
            name={'Daily fees accrued'}
            fill={'#fff'}
            maxBarSize={20}
          />
          <Line
            isAnimationActive={false}
            type='monotone'
            dot={false}
            strokeWidth={1}
            stroke={BRIGHT_GREEN}
            dataKey='cumulative_fees_accrued'
            yAxisId='right'
            name='Cumulative fees accrued'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
