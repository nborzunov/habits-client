import { Box, Grid, GridItem } from '@chakra-ui/react';
import HabitsList from '~/Habits/components/HabitsList/HabitsList';
import { Outlet } from 'react-router-dom';

const Habits = () => {
    return (
        <Box>
            <Grid templateColumns='460px 1fr'>
                <GridItem>
                    <HabitsList />
                </GridItem>
                <GridItem>
                    <Outlet />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Habits;
