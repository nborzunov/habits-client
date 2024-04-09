import { Box, Grid, GridItem } from '@chakra-ui/react';
import { AccountsWidget } from '@widgets/account-list';
import { TransactionsWidget } from '@widgets/transaction-list';

export const FinanceWidgets = () => {
    return (
        <Box>
            <Grid gap={4} templateColumns={'repeat(2, 450px)'}>
                <GridItem>
                    <TransactionsWidget />
                </GridItem>
                <GridItem>
                    <AccountsWidget />
                </GridItem>
            </Grid>
        </Box>
    );
};
