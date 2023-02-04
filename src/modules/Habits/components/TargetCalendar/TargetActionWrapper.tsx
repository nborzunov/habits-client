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
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';
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

    const { t } = useTranslation();

    const formattedDate = useMemo(() => date?.format('D MMMM YYYY'), [date]);

    const label = useMemo(() => {
        if (!target) {
            return formattedDate;
        }
        switch (target?.targetType) {
            case TargetType.Done:
                return t('habits:completedOn', {
                    prefix: t(`habits:${habit.goalType}`, { count: habit.goal }),
                    date: formattedDate,
                });
            case TargetType.Skip:
                return t('habits:skipOn', { date: formattedDate });
        }
    }, [target, formattedDate, habit?.goal, habit?.goalType, t]);

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
        onChangeTarget(target?.id, date.toDate(), TargetType.Skip, 0);
    }, [target?.id, date, onChangeTarget]);

    const onReset = useCallback(() => {
        onChangeTarget(target?.id, date.toDate(), TargetType.Empty);
    }, [target?.id, date, onChangeTarget]);

    const isMobile = useMobile();

    return (
        <>
            <Menu isLazy>
                <Tooltip label={label} isDisabled={!showTooltip}>
                    <MenuButton as={Box} onClick={(e) => e.stopPropagation()} userSelect={'none'}>
                        {children}
                    </MenuButton>
                </Tooltip>

                <MenuList p={0}>
                    {isMobile && (
                        <Text color='gray.600' p={2} px={3} fontWeight='bold' textAlign={'left'}>
                            {label}
                        </Text>
                    )}
                    {(target?.targetType !== TargetType.Done ||
                        (habit?.allowPartialCompletion && target?.value !== habit?.goal)) && (
                        <TargetCellMenuItem
                            onClick={() => onComplete()}
                            label={t('habits:operations.complete')}
                            icon={Icons.Complete}
                        />
                    )}
                    {((habit?.allowPartialCompletion && Number(target?.value) <= habit?.goal) ||
                        habit?.allowOverGoalCompletion) && (
                        <TargetCellMenuItem
                            onClick={() => onOpenSetTarget()}
                            label={t('habits:operations.set')}
                            icon={Icons.Edit}
                        />
                    )}

                    {target?.targetType !== TargetType.Skip && habit?.allowSkip && (
                        <TargetCellMenuItem
                            onClick={() => onSkip()}
                            label={t('habits:operations.skip')}
                            icon={Icons.ArrowRight}
                        />
                    )}
                    {target && (
                        <TargetCellMenuItem
                            onClick={() => onReset()}
                            label={t('habits:operations.clear')}
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
