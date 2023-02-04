import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';

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
