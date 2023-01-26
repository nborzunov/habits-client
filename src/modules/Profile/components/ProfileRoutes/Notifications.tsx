import { Box } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';

export const Notifications = () => {
    const user = useRecoilValue(activeUserState);
    useTitle(`${user?.name} ${user?.surname} - Notifications`);

    return <Box>Notifications</Box>;
};
