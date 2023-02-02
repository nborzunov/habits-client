import { useMediaQuery } from '@chakra-ui/react';
import { useMemo } from 'react';
import { MEDIA_QUERIES } from '~/common/constants';

type Dimensions = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
const useRelativeSize = (sectionSizes: { [key in Dimensions]: number }) => {
    const [_, isMdDimension, isLgDimension, lsXlDimension, is2xlDimension] =
        useMediaQuery(MEDIA_QUERIES);

    return useMemo(() => {
        if (is2xlDimension && sectionSizes['2xl']) {
            return sectionSizes['2xl'];
        }
        if (lsXlDimension && sectionSizes.xl) {
            return sectionSizes.xl;
        }
        if (isLgDimension && sectionSizes.lg) {
            return sectionSizes.lg;
        }
        if (isMdDimension && sectionSizes.md) {
            return sectionSizes.md;
        }
        return sectionSizes.sm ?? 0;
    }, [isMdDimension, isLgDimension, lsXlDimension, is2xlDimension, sectionSizes]);
};

export default useRelativeSize;
