import { Box, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HabitDetails, HabitsList } from '~/modules/Habits';

export const HabitsPage = () => {
    return (
        <Box>
            <Grid templateColumns='460px 1fr'>
                <GridItem>
                    <HabitsList />
                </GridItem>
                <GridItem>
                    <Routes>
                        <Route path={':habitId'} element={<HabitDetails />} />
                    </Routes>
                </GridItem>
            </Grid>
        </Box>
    );
};
