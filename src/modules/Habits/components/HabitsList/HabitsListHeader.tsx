import { Button, Flex, Heading, Icon, useDisclosure, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const createHabit = useMutation({
        mutationFn: (data: HabitData) =>
            api
                .post('habits/', { json: data })
                .json<Habit>()
                .then((newHabit) => setHabits((prev) => [newHabit, ...prev]))
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyCreated'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch((err) =>
                    toast({
                        title: t('common:error'),
                        description:
                            err.status === 401
                                ? t('common:invalidCredentials')
                                : t('common:serverError'),
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
                        {t('habits:allHabits')}
                    </Heading>
                </Flex>

                <Button colorScheme='blue' variant='solid' size='sm' onClick={onOpen}>
                    <Icon as={Icons.Add} fontSize={'20px'} /> {t('habits:addHabit')}
                </Button>
            </Flex>
            <EditHabitDialog onSubmit={handleSubmit} isOpen={isOpen} onClose={onClose} />
        </>
    );
};
