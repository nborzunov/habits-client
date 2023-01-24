import React from 'react';
import { Box } from '@chakra-ui/react';
import useTitle from '~/common/hooks/useTitle';

const Notifications = ({ title }: { title: string }) => {
    useTitle(title);

    return <Box>Notifications</Box>;
};

export default Notifications;
