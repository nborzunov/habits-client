import { Box, Heading } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { useTitle } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

export const DeleteAccount = () => {
    const user = useRecoilValue(activeUserState);

    const { t } = useTranslation();

    useTitle(`${user?.name} ${user?.surname} - ${t('common:delete')}`);

    return (
        <Box>
            <Heading as='h3' size='md' mb={'6'}>
                {t('common:deleteAccount')}
            </Heading>
        </Box>
    );
};
