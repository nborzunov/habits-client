import React from 'react';
import { Box } from '@chakra-ui/react';
import useTitle from "~/common/hooks/useTitle";

const DeleteAccount = ({title}: {title: string}) => {
    useTitle(title);

    return <Box>delete</Box>;
};

export default DeleteAccount;
