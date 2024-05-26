import { Flex, Grid, GridItem, Heading, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { CheerChart } from '@features/cheer-chart';
import { openCreateHabitDialog } from '@features/manage-habit';
import { TodaysHabits } from '@features/todays-habits';
import { TorchChart } from '@features/torch-chart';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

const BentoItem = ({
    children,
    colSpan,
    rowSpan,
}: {
    children: React.ReactNode;
    colSpan: number;
    rowSpan: number;
}) => {
    return (
        <GridItem
            colSpan={colSpan}
            rowSpan={rowSpan}
            bg='white'
            border='1px solid'
            borderColor='gray.200'
            borderRadius='2xl'
            p='4'
            boxShadow='lg'
        >
            {children}
        </GridItem>
    );
};
export const HabitsPage = () => {
    const { t } = useTranslation();
    return (
        <Flex
            h='100vh'
            direction='column'
            bgGradient='linear(to-t, blue.50, blue.50, whiteAlpha.50)'
        >
            <Flex justify='space-between' m='5' mb='2.5'>
                <Flex direction='column'>
                    <Heading fontSize='24px'>Hello, Nikolay👋</Heading>
                    <Text color='gray.500'>Let&apos;s check your stats today!</Text>
                </Flex>

                <Tooltip label={t('habits:createNewHabit')}>
                    <IconButton
                        size={'lg'}
                        colorScheme={'teal'}
                        icon={<Icon as={Icons$.Add} />}
                        aria-label={'create-new-habit'}
                        borderRadius={'lg'}
                        onClick={() => openCreateHabitDialog({})} // TODO
                    />
                </Tooltip>
            </Flex>
            <Grid
                templateRows={'repeat(3, 1fr)'}
                templateColumns={'repeat(4, 1fr)'}
                gap='4'
                m='5'
                mt='2.5'
                h='calc(100vh - 100px)'
            >
                <BentoItem colSpan={1} rowSpan={1}>
                    <TodaysHabits />
                </BentoItem>

                <BentoItem colSpan={2} rowSpan={1}>
                    <TorchChart />
                </BentoItem>

                <BentoItem colSpan={1} rowSpan={1}>
                    <CheerChart />
                </BentoItem>

                <BentoItem colSpan={2} rowSpan={1}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Weekly habits calendar
                    </Flex>
                </BentoItem>

                <BentoItem colSpan={2} rowSpan={2}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Pie chart
                    </Flex>
                </BentoItem>

                <BentoItem colSpan={1} rowSpan={1}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Friends activity
                    </Flex>
                </BentoItem>

                <BentoItem colSpan={1} rowSpan={1}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Profile stats
                    </Flex>
                </BentoItem>
            </Grid>
        </Flex>
    );
};
