import { PlacementWithLogical, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ErrorWrapper = ({
    error,
    children,
    hide,
    placement = 'bottom',
}: {
    error: any;
    children: React.ReactNode;
    placement?: PlacementWithLogical;
    hide?: boolean;
}) => {
    const { t } = useTranslation();
    return (
        <Tooltip
            hasArrow
            bg='red.500'
            label={t(error?.message)}
            isOpen={error && !hide}
            placement={placement}
        >
            {children}
        </Tooltip>
    );
};
