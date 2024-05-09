import { Flex, Grid, GridItem, Heading, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
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
            boxShadow='md'
        >
            <Flex alignItems='center' justifyContent='center' h='100%' fontWeight='semibold'>
                {children}
            </Flex>
        </GridItem>
    );
};
export const HabitsPage = () => {
    const { t } = useTranslation();
    return (
        <Flex h='100vh' direction='column'>
            <Flex justifyContent='space-between' m='6' mb='3'>
                <Flex flexDir='column'>
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
                        onClick={() => {}} // TODO
                    />
                </Tooltip>
            </Flex>
            <Grid
                templateRows={'repeat(3, 1fr)'}
                templateColumns={'repeat(4, 1fr)'}
                gap={4}
                m='6'
                mt='3'
                h='calc(100vh - 100px)'
            >
                <BentoItem colSpan={1} rowSpan={1}>
                    <div>Todays Habits</div>
                </BentoItem>

                <BentoItem colSpan={2} rowSpan={1}>
                    <div>Torch chart</div>
                </BentoItem>

                <BentoItem colSpan={1} rowSpan={1}>
                    <div>Cheer chart</div>
                </BentoItem>

                <BentoItem colSpan={2} rowSpan={1}>
                    <div>Weekly habits calendar</div>
                </BentoItem>

                <BentoItem colSpan={2} rowSpan={2}>
                    <div>Pie chart</div>
                </BentoItem>

                <BentoItem colSpan={1} rowSpan={1}>
                    <div>Friends activity</div>
                </BentoItem>

                <BentoItem colSpan={1} rowSpan={1}>
                    <div>Profile stats</div>
                </BentoItem>
            </Grid>
        </Flex>
    );
};
