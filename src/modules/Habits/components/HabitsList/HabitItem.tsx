import {
    Box,
    Button,
    Flex,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSetRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
import api from '~/common/helpers/api';
import { setTitle } from '~/common/hooks/useTitle';
import { habitsState } from '~/common/store/atoms';
import { EditHabitDialog } from '~/modules/Habits/components/HabitDetails';
import { CompletedCheckbox } from '~/modules/Habits/components/HabitsList';
import { Habit, HabitData } from '~/modules/Habits/types';
import ConfirmationDialog from '~/ui/ConfirmationDialog';

export const HabitItem = ({ habit }: { habit: Habit }) => {
    const setHabits = useSetRecoilState(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const selected = selectedHabitId && habit.id === selectedHabitId;

    if (selected) {
        setTitle(
            t('habits:selectedHabit', {
                title: habit.title,
            }),
        );
    } else {
        setTitle(t('habits:allHabits'));
    }
    const completed = habit.completedToday;

    const toast = useToast();
    const editHabit = useMutation({
        mutationFn: (data: HabitData) => {
            return api
                .put(`habits/${habit.id}`, { json: data })
                .json<Habit>()
                .then((newHabit) => {
                    setHabits((prev) => prev.map((h) => (h.id === habit.id ? newHabit : h)));
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyUpdated'),
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
                .finally(() => onCloseEditHabit());
        },
    });

    const deleteHabit = useMutation({
        mutationFn: () => {
            return api
                .delete(`habits/${habit.id}`)
                .json<Habit>()
                .then(() => {
                    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
                    if (selectedHabitId === habit.id) {
                        navigate('/habits');
                    }
                })
                .finally(() => onCloseDeleteConfirm());
        },
    });

    const archiveHabit = useMutation({
        mutationFn: () => {
            return api
                .put(`habits/${habit.id}/archive/`)
                .json<Habit>()
                .then(() => {
                    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
                    if (selectedHabitId === habit.id) {
                        navigate('/habits');
                    }
                })
                .finally(() => onCloseDeleteConfirm());
        },
    });

    const cleanData = useMutation({
        mutationFn: () => {
            return api
                .put(`habits/${habit.id}/clean`)
                .then(() => {
                    setHabits((prev) =>
                        prev.map((h) => ({
                            ...h,
                            targets: h.id === habit.id ? [] : h.targets,
                        })),
                    );
                    onCloseConfirmClean();
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyCleaned.all'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch(() => {
                    toast({
                        title: t('common:error'),
                        description: t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        },
    });

    const handleEdit = (h: HabitData) => {
        editHabit.mutate(h);
    };

    const handleDelete = () => {
        deleteHabit.mutate();
    };
    const handleArchive = () => {
        archiveHabit.mutate();
    };

    const selectHabit = (habitId: string) => {
        navigate(`/habits/${habitId}`);
    };

    const handleCleanData = () => {
        cleanData.mutate();
    };

    const {
        isOpen: isOpenDeleteConfirm,
        onOpen: onOpenDeleteConfirm,
        onClose: onCloseDeleteConfirm,
    } = useDisclosure();
    const cancelRef = useRef();

    const {
        isOpen: isOpenEditHabit,
        onOpen: onOpenEditHabit,
        onClose: onCloseEditHabit,
    } = useDisclosure();

    const {
        isOpen: isOpenCleanConfirm,
        onOpen: onOpenCleanConfirm,
        onClose: onCloseConfirmClean,
    } = useDisclosure();

    const ref = useRef<HTMLDivElement>(null);

    return (
        <>
            <Box
                key={habit.id}
                ref={ref}
                onClick={(e) => {
                    if (ref.current === e.target) {
                        selectHabit(habit.id);
                    }
                }}
                bg={selected ? 'blackAlpha.50' : 'transparent'}
                transition='all 0.2s ease'
                _hover={{
                    bg: selected ? 'blackAlpha.200' : 'blackAlpha.50',
                    cursor: 'pointer',
                }}
                p={2}
                px={4}
                h='64px'
                display='flex'
                justifyContent='space-between'
                alignItems='center'
            >
                <Flex alignItems={'center'} justifyContent={'center'}>
                    <CompletedCheckbox value={completed} habit={habit}></CompletedCheckbox>
                    <Flex flexDir='column' justifyContent='center'>
                        <Text fontSize='lg'>{habit.title}</Text>

                        <Text fontSize='sm' color='gray.600'>
                            {t(`habits:${habit.goalType}`, { count: habit.goal })}
                        </Text>
                    </Flex>
                </Flex>
                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<Icon as={Icons.Menu} />}
                        variant='ghost'
                        size='sm'
                        onClick={(e) => e.stopPropagation()}
                    />
                    <MenuList p={0}>
                        <OperationMenuItem
                            onClick={onOpenEditHabit}
                            icon={Icons.Edit}
                            label={t('common:edit')}
                        />

                        {habit.targets.length > 0 && (
                            <OperationMenuItem
                                onClick={onOpenCleanConfirm}
                                icon={Icons.Delete}
                                label={t('habits:cleanTargets')}
                            />
                        )}

                        <OperationMenuItem
                            onClick={handleArchive}
                            icon={Icons.Archive}
                            label={t('habits:archive')}
                        />
                        <OperationMenuItem
                            onClick={onOpenDeleteConfirm}
                            icon={Icons.TrashBin}
                            label={t('habits:delete')}
                        />
                    </MenuList>
                </Menu>
            </Box>

            <ConfirmationDialog
                isOpen={isOpenDeleteConfirm}
                onClose={onCloseDeleteConfirm}
                cancelRef={cancelRef}
                title={t('habits:deleteHabit', { title: habit.title })}
                text={t('habits:deleteHabitDescription')}
            >
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    onClick={onCloseDeleteConfirm}
                >
                    Cancel
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    colorScheme='blue'
                    onClick={handleArchive}
                    ml={3}
                >
                    {t('habits:archive')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    colorScheme='red'
                    onClick={handleDelete}
                    ml={3}
                >
                    {t('habits:delete')}
                </Button>
            </ConfirmationDialog>

            <ConfirmationDialog
                isOpen={isOpenCleanConfirm}
                onClose={onCloseConfirmClean}
                cancelRef={cancelRef}
                title={t('common:cleanData')}
                text={t('common:confirmText')}
            >
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    onClick={onCloseConfirmClean}
                >
                    {t('common:cancel')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    colorScheme='red'
                    onClick={handleCleanData}
                    ml={3}
                >
                    {t('common:clean')}
                </Button>
            </ConfirmationDialog>

            <EditHabitDialog
                isOpen={isOpenEditHabit}
                onClose={onCloseEditHabit}
                onSubmit={handleEdit}
                initialState={habit}
            />
        </>
    );
};

export const OperationMenuItem = ({
    onClick,
    icon,
    label,
}: {
    onClick?: () => void;
    icon?: any;
    label: string;
}) => {
    return (
        <MenuItem
            onClick={onClick}
            pl='4'
            rounded='md'
            py='3'
            cursor='pointer'
            color='gray.600'
            _hover={{
                bg: 'purple.300',
                color: 'whiteAlpha.900',
            }}
            role='group'
            fontWeight='semibold'
            transition='.15s ease'
        >
            <Flex alignItems={'center'}>
                {icon && <Icon as={icon} mr={2} />}
                <Text>{label}</Text>
            </Flex>
        </MenuItem>
    );
};
