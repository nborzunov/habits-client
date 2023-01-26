import { Box } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';

export const DeleteAccount = () => {
    const user = useRecoilValue(activeUserState);
    useTitle(`${user?.name} ${user?.surname} - Delete`);

    return <Box>delete</Box>;
};
