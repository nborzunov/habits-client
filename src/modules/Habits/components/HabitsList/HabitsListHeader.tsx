import { Button, Flex, Heading, Icon, useDisclosure, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';
import { EditHabitDialog } from '~/modules/Habits/components/HabitDetails';
import { Habit, HabitData } from '~/modules/Habits/types';
import { MobileMenu } from '~/ui/Layout/components/MobileMenu';

export const HabitsListHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const setHabits = useSetRecoilState(habitsState);

    const toast = useToast();

    const createHabit = useMutation({
        mutationFn: (data: HabitData) =>
            api
                .post<Habit>('/habits/', data)
                .then((res) => res.data)
                .then((newHabit) => setHabits((prev) => [newHabit, ...prev]))
                .then(() =>
                    toast({
                        title: 'Success',
                        description: 'Successfully created habit!',
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch((err) =>
                    toast({
                        title: 'Error',
                        description:
                            err.status === 401 ? 'Invalid credentials' : 'Something went wrong',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    }),
                )
                .finally(() => {
                    onClose();
                }),
    });
    const handleSubmit = (formData: HabitData) => {
        createHabit.mutate(formData);
    };

    return (
        <>
            <Flex justifyContent='space-between' alignItems='center' p={4}>
                <Flex alignItems={'center'}>
                    <MobileMenu />
                    <Heading as='h3' size='md'>
                        All habits
                    </Heading>
                </Flex>

                <Button colorScheme='blue' variant='solid' size='sm' onClick={onOpen}>
                    <Icon as={Icons.Add} fontSize={'20px'} /> Add Habits
                </Button>
            </Flex>
            <EditHabitDialog onSubmit={handleSubmit} isOpen={isOpen} onClose={onClose} />
        </>
    );
};
