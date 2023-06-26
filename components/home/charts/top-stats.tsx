'use strict'
import React from 'react';
import { Box, Grid, Text, Spinner } from '@chakra-ui/react';
import { total_users, total_usd_volume, total_deposits, total_withdrawals, total_notional_liquidated } from "../../../constants/api"
import { useRequest } from '@/hooks/useRequest';
import { formatNumber } from '@/utils/formatting';

const REQUESTS = [
    total_users,
    total_usd_volume,
    total_deposits,
    total_withdrawals,
    total_notional_liquidated,
];

const Card = (props: any) => (
    <Box
        borderRadius="md"
        bg="white"
        boxShadow="base"
        p={5}
        {...props}
    />
);

const Loader = () => <Box w="100%" display="flex" justifyContent="center"><Spinner display="flex" w="20px" h="20px" /></Box>

const TopStats = () => {

    const [dataTotalUsers, loadingTotalUsers, errorTotalUsers] = useRequest(REQUESTS[0], 0, "total_users", true);
    const [dataTotalUsdVol, loadingUsdVol, errorUsdVol] = useRequest(REQUESTS[1], 0, "total_usd_volume", true);
    const [dataTotalDeposits, loadingTotalDeposits, errorTotalDeposits] = useRequest(REQUESTS[2], 0, "total_deposits", true);
    const [dataTotalWithdrawals, loadingTotalWithdrawals, errorTotalWithdrawals] = useRequest(REQUESTS[3], 0, "total_withdrawals", true);
    const [dataTotalNotionalLiquidated, loadingTotalNotionalLiquidated, errorTotalNotionalLiquidated] = useRequest(REQUESTS[4], 0, "total_notional_liquidated", true);

    return (
        <Grid
            gridTemplateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(5, 1fr)',
            }}
            gap={5}
            w="100%"
            mt="2rem"
        >
            <Card bg="#0f2e29" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center">
                    {dataTotalUsers ? formatNumber(dataTotalUsers) : errorTotalUsers ? "Error" : null}
                </Text>
                <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalUsers}>
                    Total Users
                </Text>
                {loadingTotalUsers && <Loader />}
            </Card>
            <Card bg="#0f2e29" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center">
                    {dataTotalUsdVol ? `$${formatNumber(dataTotalUsdVol, 0)}` : errorUsdVol ? "Error" : null}
                </Text>
                <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalUsdVol}>
                    Total non-HLP Volume
                </Text>
                {loadingUsdVol && <Loader />}
            </Card>
            <Card bg="#0f2e29" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center">
                    {dataTotalDeposits ? `$${formatNumber(dataTotalDeposits, 0)}` : errorTotalDeposits ? "Error" : null}
                </Text>
                <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalDeposits}>
                    Total Deposits
                </Text>
                {loadingTotalDeposits && <Loader />}
            </Card >
            <Card bg="#0f2e29" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center">
                    {dataTotalWithdrawals ? `$${formatNumber(Math.abs(dataTotalWithdrawals), 0)}` : errorTotalWithdrawals ? "Error" : null}
                </Text>
                <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalWithdrawals}>
                    Total Withdrawals
                </Text>
                {loadingTotalWithdrawals && <Loader />}
            </Card >
            <Card bg="#0f2e29" boxShadow="0px 0px 7px rgb(0 0 0 / 20%)">
                <Text fontSize="xl" w="100%" fontWeight="bold" textAlign="center">
                    {dataTotalNotionalLiquidated ? `$${formatNumber(dataTotalNotionalLiquidated, 0)}` : errorTotalNotionalLiquidated ? "Error" : null}
                </Text>
                <Text fontSize="md" textAlign="center" mt="0.5rem" hidden={!dataTotalNotionalLiquidated}>
                    Total Notional Liquidated
                </Text>
                {loadingTotalNotionalLiquidated && <Loader />}
            </Card >
        </Grid >
    );
};

export default TopStats;
