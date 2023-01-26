import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import Icons from '~/common/helpers/Icons';

const Back = () => {
    return (
        <Tooltip label={'Back'}>
            <IconButton
                icon={<Icon as={Icons.Back} />}
                fontSize={'xl'}
                aria-label={'back'}
                size='lg'
                colorScheme={'purple'}
                variant={'outline'}
            />
        </Tooltip>
    );
};

export default Back;
