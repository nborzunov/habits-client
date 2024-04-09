import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { Icons$ } from '@shared/lib/Icons';
import React from 'react';

export const Back = ({ size }: { size: any }) => {
    return (
        <Tooltip label={'Back'}>
            <IconButton
                icon={<Icon as={Icons$.Back} />}
                fontSize={'xl'}
                aria-label={'back'}
                size={size}
                colorScheme={'purple'}
                variant={'outline'}
                mr={'2'}
            />
        </Tooltip>
    );
};
Back.defaultProps = {
    size: 'md',
};
