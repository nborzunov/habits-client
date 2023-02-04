import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';

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
