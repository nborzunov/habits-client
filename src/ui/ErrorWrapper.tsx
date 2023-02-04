import { Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const ErrorWrapper = ({ error, children }: any) => {
    const { t } = useTranslation();
    return (
        <Tooltip hasArrow bg='red.600' label={t(error?.message)} isOpen={error}>
            {children}
        </Tooltip>
    );
};

export default ErrorWrapper;
