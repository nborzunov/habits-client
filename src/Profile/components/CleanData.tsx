import React from 'react';
import { Box } from '@chakra-ui/react';
import useTitle from "~/common/hooks/useTitle";

const CleanData = ({title}: {title: string}) => {
    useTitle(title);

    return <Box>CleanData</Box>;
};

export default CleanData;
