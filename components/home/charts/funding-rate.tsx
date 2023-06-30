import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Box, Text, useMediaQuery } from "@chakra-ui/react"
import { useEffect, useState } from 'react';
import { useRequest } from '@/hooks/useRequest';
import ChartWrapper from '../../common/chartWrapper';
import {
    CHART_HEIGHT,
    YAXIS_WIDTH,
    BRIGHT_GREEN,
    GREEN,
    RED,
} from "../../../constants";
import {
    yaxisFormatterNumber,
    tooltipFormatter,
    tooltipLabelFormatter,
    xAxisFormatter,
    formatterPercent,
    yaxisFormatter,
} from '../../../helpers'
import { getTokenHex } from "../../../constants/tokens";
import {
    funding_rate,
} from "../../../constants/api"

const REQUESTS = [
    funding_rate
];

export default function FundingRate() {
    const [isMobile] = useMediaQuery('(max-width: 700px)');

    const [coinKeys, setCoinKeys] = useState<any[]>([])
    const [formattedData, setFormattedData] = useState<any[]>([])
    const [dataFundingRate, loadingFundingRate, errorFundingRate] = useRequest(REQUESTS[0], [], 'chart_data');

    const loading = loadingFundingRate;
    const error = errorFundingRate;

    type FundingData = {
        coin: string,
        sum_funding: number,
        time: string,
    };

    type GroupedFundingData = {
        time: Date;
        [coin: string]: number | Date;

    };

    const groupByTime = (data: FundingData[]): GroupedFundingData[] => {
        const map = new Map<string, any>();
        const coinFundingTotals = new Map<string, number>();

        data.forEach((item) => {
            const key = item.time;
            if (!map.has(key)) {
                map.set(key, {
                    time: new Date(key),
                    unit: "%"
                });
            }

            const existingEntry = map.get(key);

            const value = (existingEntry[item.coin] || 0) + item.sum_funding;

            existingEntry[item.coin] = value * 100;

            // Update total funding for the coin
            coinFundingTotals.set(item.coin, value * 100);

            map.set(key, existingEntry);
        });

        // Get the top 10 coins by total funding over the whole time period
        const topCoins = Array.from(coinFundingTotals.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([coin]) => coin);

        // Filter out the coins not in the top 10 for each time period
        const result = Array.from(map.values()).map((record: any) => {
            Object.keys(record).forEach((coin) => {
                if (coin !== 'time' && !topCoins.includes(coin) && coin !== 'unit') {
                    delete record[coin];
                }
            });
            return record;
        });

        return result;
    };


    const extractUniqueCoins = (formattedData: GroupedFundingData[]): string[] => {
        const coinSet = new Set<string>();
        for (const data of formattedData) {
            Object.keys(data).forEach(coin => {
                if (coin !== 'time' &&
                    coin !== 'unit'
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
        if (dataFundingRate) {
            const groupedData = groupByTime(dataFundingRate);
            const uniquieCoins = extractUniqueCoins(groupedData);
            setFormattedData(groupedData);
            setCoinKeys(uniquieCoins);
        }
    }

    useEffect(() => {
        if (!loading && !error) {
            formatData();
        }
    }, [loading])

    return (
        <ChartWrapper
            title="Annualized Funding Rate"
            loading={loading}
            data={formattedData}
        >
            <ResponsiveContainer width="100%" height={CHART_HEIGHT + 125}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="15 15" opacity={0.1} />
                    <XAxis dataKey="time" tickFormatter={xAxisFormatter} minTickGap={30}
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        tickMargin={10}
                    />
                    <YAxis
                        tick={{ fill: '#f9f9f9', fontSize: isMobile ? 14 : 15 }}
                        dx={6}
                        width={75}
                        tickFormatter={formatterPercent}
                    />
                    <Tooltip
                        formatter={tooltipFormatter}
                        labelFormatter={() => ''}
                        contentStyle={{
                            textAlign: 'left',
                            background: "#0A1F1B",
                            borderColor: "#061412",
                            color: "#fff",
                            boxShadow: "0px 0px 7px rgb(0 0 0 / 20%)",
                            borderRadius: "26px",
                            maxHeight: "500px"
                        }}
                        itemSorter={(item) => {
                            return Number(item.value) * -1;
                        }}
                    />
                    <Legend wrapperStyle={{ bottom: -5 }} />
                    {
                        coinKeys.map(((coinName, i) => {
                            return (
                                <Line
                                    isAnimationActive={false}
                                    dataKey={coinName.toString()}
                                    dot={false}
                                    name={coinName.toString()}
                                    stroke={getTokenHex(coinName.toString())}
                                    key={'funding-rate-line-' + i}
                                />
                            )
                        }))
                    }
                </LineChart>
            </ResponsiveContainer>
            <Box w="100%" mt="3">
                <Text color="#bbb">Top 10 Coins over time</Text>
            </Box>
        </ChartWrapper>
    )
}