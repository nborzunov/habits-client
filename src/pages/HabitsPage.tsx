import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import useMobile from '~/common/hooks/useMobile';
import { HabitDetails, HabitsList } from '~/modules/Habits';

export const HabitsPage = () => {
    const isMobile = useMobile();

    return (
        <Box>
            <Flex>
                {!isMobile && (
                    <>
                        <HabitsList />
                        <Routes>
                            <Route path={':habitId'} element={<HabitDetails />} />
                        </Routes>
                    </>
                )}
                {isMobile && (
                    <Routes>
                        <Route path={''} element={<HabitsList />} />
                        <Route path={':habitId'} element={<HabitDetails />} />
                    </Routes>
                )}
            </Flex>
        </Box>
    );
};
