import { setTitle } from '@/shared/hooks/useTitle';
import {
    Box,
    Button,
    Flex,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    Text,
} from '@chakra-ui/react';
import {
    Habit,
    HabitData,
    useArchiveHabit,
    useCleanHabit,
    useDeleteHabit,
    useEditHabit,
} from '@entities/habit';
import { useEditHabitDialog } from '@features/edit-habit-dialog';
import { openEditHabitDialog } from '@features/edit-habit-dialog/ui/EditHabitDialog';
import { Icons$ } from '@shared/lib';
import { openConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import { OperationMenuItem } from '@shared/ui/OperationMenuItem';
import { ProgressBar } from '@shared/ui/ProgressBar';
import { MouseEventHandler, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { CompletedCheckbox } from './CompletedCheckbox';

export const HabitItem = ({
    habit,
    progress,
    completed,
}: {
    habit: Habit;
    completed: boolean;
    progress: {
        count: number;
        start?: number;
        end?: number;
    };
}) => {
    const { habit_id: selectedHabitId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const selected = selectedHabitId && habit.id === selectedHabitId;

    useEffect(() => {
        if (selected) {
            setTitle(
                t('habits:selectedHabit', {
                    title: habit.title,
                }),
            );
        } else {
            setTitle(t('habits:allHabits'));
        }
    }, [selected, habit.title, t]);

    const editHabitDialog = useEditHabitDialog();

    const { mutate: editHabit } = useEditHabit(habit.id, editHabitDialog.hide);
    const { mutate: deleteHabit } = useDeleteHabit(habit.id);
    const { mutate: archiveHabit } = useArchiveHabit(habit.id);
    const { mutate: cleanData } = useCleanHabit(habit.id);

    const selectHabit = (habit_id: string) => {
        navigate(`/habits/${habit_id}`);
    };

    const menuRef = useRef<HTMLDivElement>(null);
    const completedRef = useRef<HTMLDivElement>(null);

    const onHabitClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (
            !e.target ||
            !menuRef.current ||
            !completedRef.current ||
            e.target === menuRef.current ||
            menuRef.current.contains(e.target as Node) ||
            e.target === completedRef.current ||
            completedRef.current.contains(e.target as Node)
        ) {
            return;
        }

        selectHabit(habit.id);
    };

    const onDeleteHabit = () =>
        openConfirmationDialog({
            title: t('habits:deleteHabit', { title: habit.title }),
            text: t('habits:deleteHabitDescription'),
            customFooter: (ok, cancel) => {
                return (
                    <>
                        <Button
                            size={{
                                base: 'md',
                                sm: 'md',
                            }}
                            onClick={cancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size={{
                                base: 'md',
                                sm: 'md',
                            }}
                            colorScheme='blue'
                            onClick={() => ok(() => archiveHabit())}
                            ml={3}
                        >
                            {t('habits:archive')}
                        </Button>
                        <Button
                            size={{
                                base: 'md',
                                sm: 'md',
                            }}
                            colorScheme='red'
                            onClick={() => ok(() => deleteHabit())}
                            ml={3}
                        >
                            {t('habits:delete')}
                        </Button>
                    </>
                );
            },
        });

    const onCleanHabit = () =>
        openConfirmationDialog({
            title: t('habits:cleanData'),
            text: t('habits:confirmText'),
            okText: t('common:clean'),
            cancelText: t('common:cancel'),
        })
            .then(() => cleanData())
            .catch(() => {});

    const onEditHabit = () =>
        openEditHabitDialog({
            initialState: habit,
        }).then((h: HabitData) => editHabit(h));

    return (
        <>
            <Box
                width={'100%'}
                onClick={onHabitClick}
                bg={selected ? 'blackAlpha.50' : 'transparent'}
                transition='all 0.2s ease'
                _hover={{
                    bg: selected ? 'blackAlpha.200' : 'blackAlpha.50',
                    cursor: 'pointer',
                }}
                p={2}
                px={4}
                display='flex'
                flexDir={'column'}
                justifyContent='space-between'
                alignItems='center'
            >
                <Box w={'100%'} display='flex' justifyContent='space-between' alignItems='center'>
                    <Flex alignItems={'center'} justifyContent={'center'}>
                        <CompletedCheckbox
                            value={completed}
                            habit={habit}
                            innerRef={completedRef}
                        />

                        <Flex flexDir='column' justifyContent='center' onClick={onHabitClick}>
                            <Text fontSize='lg'>{habit.title}</Text>

                            <Text fontSize='sm' color='gray.600'>
                                {t(`common:${habit.goal_type}`, { count: habit.goal })}
                            </Text>
                        </Flex>
                    </Flex>

                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<Icon as={Icons$.Menu} />}
                            variant='ghost'
                            size='sm'
                            onClick={(e) => e.stopPropagation()}
                        />
                        <MenuList p={0} ref={menuRef}>
                            <OperationMenuItem
                                onClick={onEditHabit}
                                icon={Icons$.Edit}
                                label={t('common:edit')}
                            />

                            {habit.targets.length > 0 && (
                                <OperationMenuItem
                                    onClick={onCleanHabit}
                                    icon={Icons$.Delete}
                                    label={t('habits:cleanTargets')}
                                />
                            )}

                            <OperationMenuItem
                                onClick={() => cleanData()}
                                icon={Icons$.Archive}
                                label={t('habits:archive')}
                            />
                            <OperationMenuItem
                                onClick={onDeleteHabit}
                                icon={Icons$.TrashBin}
                                label={t('habits:delete')}
                            />
                        </MenuList>
                    </Menu>
                </Box>

                {habit.total_goal > 1 && (
                    <Box width={'100%'}>
                        <ProgressBar {...progress} />
                    </Box>
                )}
            </Box>
        </>
    );
};

HabitItem.defaultProps = {
    completed: false,
};
