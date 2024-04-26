import { Box, Flex } from '@chakra-ui/react';
import { useMobile } from '@shared/hooks';
import { HabitDetails } from '@widgets/habit-details';
import { HabitsList } from '@widgets/habits-list';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const HabitsPage = () => {
    const isMobile = useMobile();

    return (
        <Box>
            <Flex>
                {!isMobile && (
                    <>
                        <HabitsList />
                        <Routes>
                            <Route path={':habit_id'} element={<HabitDetails />} />
                        </Routes>
                    </>
                )}
                {isMobile && (
                    <Routes>
                        <Route path={''} element={<HabitsList />} />
                        <Route path={':habit_id'} element={<HabitDetails />} />
                    </Routes>
                )}
            </Flex>
        </Box>
    );
};
