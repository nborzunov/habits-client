import { useMediaQuery } from '@chakra-ui/react';
import { MEDIA_QUERIES } from '@shared/const';
import { useMemo } from 'react';

export const useMobile = () => {
    const [isSmDimension, isMdDimension] = useMediaQuery(MEDIA_QUERIES);

    return useMemo(() => isSmDimension || isMdDimension, [isSmDimension, isMdDimension]);
};
