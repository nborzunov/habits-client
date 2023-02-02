import { useMediaQuery } from '@chakra-ui/react';
import { useMemo } from 'react';
import { MEDIA_QUERIES } from '~/common/constants';

const useMobile = () => {
    const [isSmDimension, isMdDimension] = useMediaQuery(MEDIA_QUERIES);

    return useMemo(() => isSmDimension || isMdDimension, [isSmDimension, isMdDimension]);
};

export default useMobile;
