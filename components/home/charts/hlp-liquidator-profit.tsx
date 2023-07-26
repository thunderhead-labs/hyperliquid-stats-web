import React, { useEffect, useState } from 'react';
import {
  Bar,
  Cell,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { sortBy, maxBy, minBy } from 'lodash';
import { useMediaQuery } from '@chakra-ui/react';
import { useRequest } from '@/hooks/useRequest';
import {
  hlp_liquidator_pnl,
  cumulative_hlp_liquidator_pnl,
  hlp_liquidator_pnl_false,
  cumulative_hlp_liquidator_pnl_false,
} from '../../../constants/api';
import ChartWrapper from '../../common/chartWrapper';
import { CHART_HEIGHT, YAXIS_WIDTH, BRIGHT_GREEN, GREEN, RED } from '../../../constants';
import { yaxisFormatter, xAxisFormatter, tooltipFormatterCurrency, tooltopFormatterDate } from '../../../helpers';

const REQUESTS = [
  hlp_liquidator_pnl,
  cumulative_hlp_liquidator_pnl,
  hlp_liquidator_pnl_false,
  cumulative_hlp_liquidator_pnl_false,
];

export default function HLPProfitLossChart() {
  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const [chartDataLiquidator, setChartDataLiquidator] = useState<any>(null);
  const [chartDataNonLiquidator, setChartDataNonLiquidator] = useState<any>(null);
  const [dataMode, setDataMode] = useState<'HLP' | 'NON_HLP'>('HLP');
  const [dataHLPLiquidatorPNL, loadingHLPLiquidatorPNL, errorHLPLiquidatorPNL] = useRequest(
    REQUESTS[0],
    [],
    'chart_data'
  );
  const [dataCumulativeHLPLiquidatorPNL, loadingCumulativeHLPLiquidatorPNL] = useRequest(
    REQUESTS[1],
    [],
    'chart_data'
  );
  const [dataNonLiquidator] = useRequest(REQUESTS[2], [], 'chart_data');
  const [dataCumulativeNonLiquidatorPNL] = useRequest(REQUESTS[3], [], 'chart_data');

  const formatTradingData = (dataHLPLiquidatorPNL: any, dataCumulativeHLPLiquidatorPNL: any) => {
    let currentProfitCumulative = 0;
    let currentLossCumulative = 0;

    let data = sortBy(dataHLPLiquidatorPNL, (i) => Date.parse(i.time)).map((dataItem, index) => {
      const cumulative_pnl = dataCumulativeHLPLiquidatorPNL[index]?.cumulative_pnl || 0;
      return {
        cumulative_pnl: cumulative_pnl,
        total_pnl: dataItem.total_pnl,
        timestamp: new Date(dataItem.time),
        profit_cumulative: cumulative_pnl > 0 ? cumulative_pnl : 0,
        loss_cumulative: cumulative_pnl < 0 ? cumulative_pnl : 0,
        unit: 'single',
      };
    });

    let result;

    if (data && data.length > 0) {
      const maxProfit = maxBy(data, (item) => item.profit_cumulative)?.profit_cumulative || 0;
      const maxLoss = minBy(data, (item) => item.loss_cumulative)?.loss_cumulative || 0;
      const maxPnl = maxBy(data, (item) => item.total_pnl)?.total_pnl || 0;
      const minPnl = minBy(data, (item) => item.total_pnl)?.total_pnl || 0;
      const maxCurrentCumulativePnl =
        maxBy(data, (item) => item.cumulative_pnl)?.cumulative_pnl || 0;
      const minCurrentCumulativePnl =
        minBy(data, (item) => item.cumulative_pnl)?.cumulative_pnl || 0;

      const stats = {
        maxProfit,
        maxLoss,
        currentProfitCumulative,
        currentLossCumulative,
        maxCurrentCumulativeProfitLoss: Math.max(currentProfitCumulative, -currentLossCumulative),
        minAbsPnl: minPnl,
        maxAbsPnl: Math.max(Math.abs(maxPnl), Math.abs(minPnl)),
        maxAbsCumulativePnl: Math.max(
          Math.abs(maxCurrentCumulativePnl),
          Math.abs(minCurrentCumulativePnl)
        ),
      };
      result = {
        data,
        stats,
      };
    }
    return result;
  };

  useEffect(() => {
    if (
      dataHLPLiquidatorPNL.length > 0 &&
      dataCumulativeHLPLiquidatorPNL.length > 0 &&
      dataNonLiquidator.length > 0 &&
      dataCumulativeNonLiquidatorPNL.length > 0
    ) {
      const formattedTradingData = formatTradingData(
        dataHLPLiquidatorPNL,
        dataCumulativeHLPLiquidatorPNL
      );
      const formattedDataNonLiquidator = formatTradingData(
        dataNonLiquidator,
        dataCumulativeNonLiquidatorPNL
      );
      setChartDataLiquidator(formattedTradingData);
      setChartDataNonLiquidator(formattedDataNonLiquidator);
    }
  }, [
    dataHLPLiquidatorPNL,
    dataCumulativeHLPLiquidatorPNL,
    dataNonLiquidator,
    dataCumulativeNonLiquidatorPNL,
  ]);

  const controls = {
    toggles: [
      {
        text: 'HLP',
        event: () => setDataMode('HLP'),
        active: dataMode === 'HLP',
      },
      {
        text: 'Liquidator',
        event: () => setDataMode('NON_HLP'),
        active: dataMode === 'NON_HLP',
      },
    ],
  };

  const chartInfo = dataMode === 'HLP' ? chartDataLiquidator : chartDataNonLiquidator;
  const chartData = chartInfo ? chartInfo.data : [];
  const domainYRight = [
    -chartInfo?.stats.maxAbsCumulativePnl * 1.1,
    chartInfo?.stats.maxAbsCumulativePnl * 1.1,
  ];
  const domainYLeft = [-chartInfo?.stats.maxAbsPnl * 1.1, chartInfo?.stats.maxAbsPnl * 1.1];

  return (
    <ChartWrapper
      title='Protocol Vault PnL'
      loading={loadingHLPLiquidatorPNL && loadingCumulativeHLPLiquidatorPNL}
      data={chartData}
      controls={controls}
    >
      <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray='15 15' opacity={0.1} />
          <XAxis
            dataKey='timestamp'
            tickFormatter={xAxisFormatter}
            minTickGap={30}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
            tickMargin={10}
          />
          <YAxis
            domain={domainYRight}
            orientation='right'
            yAxisId='right'
            tickFormatter={yaxisFormatter}
            width={YAXIS_WIDTH}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
          />
          <YAxis
            domain={domainYLeft}
            tickFormatter={yaxisFormatter}
            width={YAXIS_WIDTH}
            tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
          />
          <Tooltip
            formatter={tooltipFormatterCurrency}
            labelFormatter={tooltopFormatterDate}
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
          <Bar type='monotone' fill={'#FFF'} dataKey='total_pnl' name='Net PnL'>
            {(chartData || []).map((item: any, i: number) => {
              return <Cell key={`cell-${i}`} fill={item.total_pnl > 0 ? GREEN : RED} />;
            })}
            maxBarSize={20}
          </Bar>
          <Line
            type='monotone'
            strokeWidth={1}
            stroke={BRIGHT_GREEN}
            dataKey='cumulative_pnl'
            name='Cumulative PnL'
            dot={false}
            yAxisId='right'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
