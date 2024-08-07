import {
    BoxProps,
    Flex,
    Grid,
    GridItem,
    Heading,
    Icon,
    IconButton,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { CheerChart } from '@features/cheer-chart';
import { GridHabitsChart } from '@features/grid-habits-chart';
import { openCreateHabitDialog } from '@features/manage-habit';
import { TodaysHabits } from '@features/todays-habits';
import { TorchChart } from '@features/torch-chart';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

const BentoItem = ({
    children,
    colSpan,
    rowSpan,
    ...props
}: {
    children: React.ReactNode;
    colSpan: number;
    rowSpan: number;
} & BoxProps) => {
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
            {...props}
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
                        onClick={() => openCreateHabitDialog({})}
                    />
                </Tooltip>
            </Flex>
            <Grid
                templateRows={'repeat(9, 1fr)'}
                templateColumns={'repeat(12, 1fr)'}
                gap='4'
                m='5'
                mt='2.5'
                h='calc(100vh - 100px)'
            >
                <BentoItem colSpan={3} rowSpan={3}>
                    <TodaysHabits />
                </BentoItem>

                <BentoItem colSpan={6} rowSpan={3}>
                    <TorchChart />
                </BentoItem>

                <BentoItem colSpan={3} rowSpan={3} p={0}>
                    <CheerChart />
                </BentoItem>

                <BentoItem colSpan={9} rowSpan={3}>
                    <GridHabitsChart />
                </BentoItem>

                <BentoItem colSpan={3} rowSpan={3}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Pie chart
                    </Flex>
                </BentoItem>

                <BentoItem colSpan={3} rowSpan={3}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Friends activity
                    </Flex>
                </BentoItem>

                <BentoItem colSpan={3} rowSpan={3}>
                    <Flex align='center' justify='center' h='100%' fontWeight='semibold'>
                        Profile stats
                    </Flex>
                </BentoItem>
            </Grid>
        </Flex>
    );
};
