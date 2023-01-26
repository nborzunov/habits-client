import {
    Box,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { Dayjs } from 'dayjs';
import React, { PropsWithChildren, useCallback, useContext, useMemo } from 'react';
import Icons from '~/common/helpers/Icons';
import { SetTargetDialog } from '~/modules/Habits/components/TargetCalendar';
import { Habit, Target, TargetType } from '~/modules/Habits/types';

interface Props {
    date: Dayjs;
    target?: Target;
    showTooltip?: boolean;
}

interface TargetActionContext {
    habit: Habit;
    onChangeTarget: (
        id: string | undefined,
        date: Date,
        targetType: TargetType,
        value?: number,
    ) => void;
}

export const TargetActionContext = React.createContext<TargetActionContext>({} as any);

export const TargetActionWrapper = ({
    date,
    target,
    showTooltip,
    children,
}: PropsWithChildren<Props>) => {
    const { habit, onChangeTarget } = useContext(TargetActionContext);
    const {
        isOpen: isSetTargetOpened,
        onOpen: onOpenSetTarget,
        onClose: onCloseSetTarget,
    } = useDisclosure();

    const formattedDate = useMemo(() => date?.format('D MMMM YYYY'), [date]);
    const periodicity = useMemo(
        () =>
            target?.value === 1
                ? habit.goalType.slice(0, habit.goalType.length - 1)
                : habit.goalType,
        [target, habit],
    );
    const prefix = useMemo(() => `${target?.value} ${periodicity} on `, [target, periodicity]);

    const label = useMemo(() => {
        if (!target) {
            return formattedDate;
        }
        switch (target?.targetType) {
            case TargetType.Done:
                return `${prefix} ${formattedDate}`;
            case TargetType.Skip:
                return 'Skip on ' + formattedDate;
            case TargetType.Empty:
                return 'Failed on ' + formattedDate;
        }
    }, [target, prefix, formattedDate]);

    const onComplete = useCallback(() => {
        onChangeTarget(target?.id, date.toDate(), TargetType.Done);
    }, [target?.id, date, onChangeTarget]);

    const onSetValue = useCallback(
        (value: number) => {
            onChangeTarget(target?.id, date.toDate(), TargetType.Done, value);
        },
        [target?.id, date, onChangeTarget],
    );

    const onSkip = useCallback(() => {
        onChangeTarget(target?.id, date.toDate(), TargetType.Skip);
    }, [target?.id, date, onChangeTarget]);

    const onReset = useCallback(() => {
        onChangeTarget(target?.id, date.toDate(), TargetType.Empty);
    }, [target?.id, date, onChangeTarget]);

    return (
        <>
            <Menu isLazy>
                <Tooltip label={label} isDisabled={!showTooltip}>
                    <MenuButton as={Box} onClick={(e) => e.stopPropagation()} userSelect={'none'}>
                        {children}
                    </MenuButton>
                </Tooltip>

                <MenuList p={0}>
                    {(target?.targetType !== TargetType.Done ||
                        (habit.allowPartialCompletion && target?.value !== habit.goal)) && (
                        <TargetCellMenuItem
                            onClick={() => onComplete()}
                            label={'Complete'}
                            icon={Icons.Complete}
                        />
                    )}
                    {((habit.allowPartialCompletion && Number(target?.value) <= habit.goal) ||
                        habit.allowOverGoalCompletion) && (
                        <TargetCellMenuItem
                            onClick={() => onOpenSetTarget()}
                            label={'Set'}
                            icon={Icons.Edit}
                        />
                    )}

                    {target?.targetType !== TargetType.Skip && (
                        <TargetCellMenuItem
                            onClick={() => onSkip()}
                            label={'Skip'}
                            icon={Icons.ArrowRight}
                        />
                    )}
                    {target && (
                        <TargetCellMenuItem
                            onClick={() => onReset()}
                            label={'Clear'}
                            icon={Icons.Delete}
                        />
                    )}
                </MenuList>
            </Menu>
            <SetTargetDialog
                habit={habit}
                target={target}
                isOpen={isSetTargetOpened}
                onClose={onCloseSetTarget}
                onSubmit={(value) => onSetValue(value)}
            />
        </>
    );
};

TargetActionWrapper.defaultProps = {
    showTooltip: true,
};
const TargetCellMenuItem = ({
    onClick,
    icon,
    label,
}: {
    onClick: () => void;
    icon: any;
    label: string;
}) => {
    return (
        <MenuItem
            onClick={onClick}
            rounded='md'
            cursor='pointer'
            color='gray.600'
            role='group'
            fontWeight='semibold'
            transition='.15s ease'
            onMouseOver={(e) => e.stopPropagation()}
            _hover={{
                bg: 'purple.300',
                color: 'whiteAlpha.900',
            }}
        >
            <Flex alignItems={'center'} align='center'>
                <Icon as={icon} mr={2} />
                <Text>{label}</Text>
            </Flex>
        </MenuItem>
    );
};
