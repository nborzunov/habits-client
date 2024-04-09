import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

import { useAddTransactionDialog } from './AddTransaction';

export const OpenAddTransactionDialogAction = () => {
    const { onOpen: onOpenAddTransaction } = useAddTransactionDialog();
    const { t } = useTranslation();

    return (
        <Tooltip label={t('finance:addTransaction')}>
            <IconButton
                size={'lg'}
                colorScheme={'teal'}
                icon={<Icon as={Icons$.Add} />}
                aria-label={'add-transaction'}
                borderRadius={'lg'}
                onClick={() => onOpenAddTransaction()}
            />
        </Tooltip>
    );
};
