import { Box, Heading } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { useTitle } from '@shared/hooks';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

export const Notifications = () => {
    const user = useRecoilValue(activeUserState);
    const { t } = useTranslation();

    useTitle(`${user?.name} ${user?.surname} - ${t('common:notifications')}`);

    return (
        <Box>
            <Heading as='h3' size='md' mb={'6'}>
                {t('common:notifications')}
            </Heading>
        </Box>
    );
};
