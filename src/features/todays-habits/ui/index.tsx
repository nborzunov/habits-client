import { theme } from '@app/providers/ThemeProvider';
import {
    Button,
    Center,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Icon,
    Spacer,
    Stack,
    Text,
} from '@chakra-ui/react';
import { TodaysHabit, useTodaysHabits } from '@entities/habit';
import { Icons$ } from '@shared/lib';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TodaysHabits = () => {
    const { t } = useTranslation();

    const { data: todaysHabits = [] } = useTodaysHabits();
    const [page, setPage] = useState(0);
    const slicedHabits = useMemo(
        () => todaysHabits.slice(page * 3, (page + 1) * 3),
        [todaysHabits, page],
    );

    return (
        <Flex direction='column' justify='space-between' height='100%'>
            <Flex justify='space-between' align='center' width='100%' pb='1.5'>
                <Text fontWeight={'700'} fontSize='md' mb='1'>
                    {t('habits:todaysHabits')}
                </Text>
                <Flex gap='2' visibility={todaysHabits.length > 3 ? 'visible' : 'hidden'}>
                    <Button
                        size='xs'
                        p={0}
                        h='20px'
                        cursor='pointer'
                        onClick={() => setPage(page - 1)}
                        isDisabled={page === 0}
                    >
                        <Icon size='xs' h='10px' as={Icons$.Up} />
                    </Button>

                    <Button
                        size='xs'
                        p={0}
                        h='20px'
                        cursor='pointer'
                        onClick={() => setPage(page + 1)}
                        isDisabled={(page + 1) * 3 >= todaysHabits.length}
                    >
                        <Icon size='xs' h='10px' as={Icons$.Down} />
                    </Button>
                </Flex>
            </Flex>

            <Stack spacing='1.5' h='100%'>
                {slicedHabits.map((habit) => (
                    <HabitCard key={habit.name} habit={habit} />
                ))}
            </Stack>
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
