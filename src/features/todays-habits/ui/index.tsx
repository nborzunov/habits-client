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
import { Icons$ } from '@shared/lib';
import { Bed, Book, Footprints } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TodaysHabits = () => {
    const { t } = useTranslation();

    const todaysHabits = [
        {
            title: 'Sleep',
            color: 'red',
            icon: 'sleep',
            progress: 80,
        },
        {
            title: 'Reading',
            color: 'blue',
            icon: 'reading',
            progress: 47,
        },
        {
            title: 'Running',
            color: 'green',
            icon: 'walk',
            progress: 13,
        },
    ];
    return (
        <Flex direction='column' justify='space-between' height='100%'>
            <Stack spacing='1.5'>
                <Text fontWeight={'700'} fontSize='md' mb='1'>
                    {t('habits:todaysHabits')}
                </Text>

                {/* TODO: limit from backend */}
                {todaysHabits.slice(0, 2).map((habit) => (
                    <HabitCard key={habit.title} habit={habit} />
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

// TODO: fix any
const HabitCard = ({ habit }: { habit: any }) => {
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
                {habit.title}
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
