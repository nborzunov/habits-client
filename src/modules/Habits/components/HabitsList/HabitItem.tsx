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
} from '@chakra-ui/react';
import React, { MouseEventHandler, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import Icons from '~/common/helpers/Icons';
import { setTitle } from '~/common/hooks/useTitle';
import { useArchiveHabit } from '~/modules/Habits/api/useArchiveHabit';
import { useCleanData } from '~/modules/Habits/api/useCleanData';
import { useDeleteHabit } from '~/modules/Habits/api/useDeleteHabit';
import { useEditHabit } from '~/modules/Habits/api/useEditHabit';
import { EditHabitDialog } from '~/modules/Habits/components/HabitDetails';
import { CompletedCheckbox } from '~/modules/Habits/components/HabitsList';
import { Habit } from '~/modules/Habits/types';
import ConfirmationDialog from '~/ui/ConfirmationDialog';

export const HabitItem = ({ habit }: { habit: Habit }) => {
    const { habitId: selectedHabitId } = useParams();
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
    const completed = habit.statistics.completedToday;

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

    const { mutate: editHabit } = useEditHabit(habit.id, onCloseEditHabit);
    const { mutate: deleteHabit } = useDeleteHabit(habit.id, onCloseDeleteConfirm);
    const { mutate: archiveHabit } = useArchiveHabit(habit.id, onCloseDeleteConfirm);
    const { mutate: cleanData } = useCleanData(habit.id, onCloseConfirmClean);

    const selectHabit = (habitId: string) => {
        navigate(`/habits/${habitId}`);
    };

    return (
        <>
            <Box
                width={'100%'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
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
                    <Flex
                        flexDir='column'
                        justifyContent='center'
                        onClick={() => selectHabit(habit.id)}
                    >
                        <Text fontSize='lg'>{habit.title}</Text>

                        <Text fontSize='sm' color='gray.600'>
                            {t(`common:${habit.goalType}`, { count: habit.goal })}
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
                            onClick={() => cleanData()}
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
                        sm: 'md',
                    }}
                    onClick={onCloseDeleteConfirm}
                >
                    Cancel
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                    colorScheme='blue'
                    onClick={() => archiveHabit()}
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
                    onClick={() => deleteHabit()}
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
                        sm: 'md',
                    }}
                    onClick={onCloseConfirmClean}
                >
                    {t('common:cancel')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                    colorScheme='red'
                    onClick={() => cleanData()}
                    ml={3}
                >
                    {t('common:clean')}
                </Button>
            </ConfirmationDialog>

            <EditHabitDialog
                isOpen={isOpenEditHabit}
                onClose={onCloseEditHabit}
                onSubmit={editHabit}
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
    onClick?: MouseEventHandler<HTMLButtonElement>;
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
