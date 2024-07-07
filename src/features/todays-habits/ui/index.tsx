import { theme } from '@app/providers/ThemeProvider';
import {
    Button,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Spacer,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useTodaysHabits } from '@entities/habit';
import { TodaysHabit } from '@entities/habit';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

export const TodaysHabits = () => {
    const { t } = useTranslation();

    const { data: todaysHabits = [] } = useTodaysHabits();

    return (
        <Flex direction='column' justify='space-between' height='100%'>
            <Stack spacing='1.5'>
                <Text fontWeight={'700'} fontSize='md' mb='1'>
                    {t('habits:todaysHabits')}
                </Text>

                {/* TODO: limit from backend */}
                {todaysHabits.slice(0, 2).map((habit) => (
                    <HabitCard key={habit.name} habit={habit} />
                ))}
            </Stack>

            {todaysHabits.length > 2 && (
                // TODO: open todays habits dialog
                <Button variant='ghost' colorScheme='blue' size='sm' mt='1.5'>
                    {t('common:seeAllCount', { count: todaysHabits.length })}
                </Button>
            )}
        </Flex>
    );
};

const HabitCard = ({ habit }: { habit: TodaysHabit }) => {
    const LucideIcon = Icons$.habitIcons[habit.icon as keyof typeof Icons$.habitIcons];
    const color = theme.colors[habit.color][500];

    return (
        <Flex
            as={Button}
            align='center'
            bg='gray.50'
            p='2'
            borderRadius='xl'
            _hover={{ bg: 'gray.100' }}
        >
            <Center p='2' bg={`${habit.color}.100`} color='white' borderRadius={'50%'} mr={2}>
                <LucideIcon color={color} strokeWidth={2.25} size={14} />
            </Center>

            <Text fontWeight='500' fontSize='sm'>
                {habit.name}
            </Text>

            <Spacer />

            <CircularProgress
                value={habit.progress}
                color={`${habit.color}.400`}
                trackColor={`${habit.color}.100`}
                size='28px'
                capIsRound
            >
                <CircularProgressLabel fontWeight='600'>{habit.progress}%</CircularProgressLabel>
            </CircularProgress>
        </Flex>
    );
};
