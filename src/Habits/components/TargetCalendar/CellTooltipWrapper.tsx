import dayjs from 'dayjs';
import { Habit, Target, TargetType } from '~/Habits/types';
import { Tooltip } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface Props {
    monthId: number;
    dayId: number;
    target?: Target;
    habit: Habit;
}

const CellTooltipWrapper = ({
    monthId,
    dayId,
    target,
    habit,
    children,
}: PropsWithChildren<Props>) => {
    const periodicity =
        target?.value === 1 ? habit.goalType.slice(0, habit.goalType.length - 1) : habit.goalType;
    const prefix = `${target?.value} ${periodicity} on `;
    const date = dayjs(`2023-${monthId + 1}-${dayId + 1}`).format('D MMMM YYYY');

    const getLabel = () => {
        switch (target?.targetType) {
            case TargetType.Done:
                return `${prefix} ${date}`;
            case TargetType.Skip:
                return 'Skip on ' + date;
            case TargetType.Empty:
                return 'Failed on ' + date;
        }
    };
    return <Tooltip label={getLabel()}>{children}</Tooltip>;
};

export default CellTooltipWrapper;
