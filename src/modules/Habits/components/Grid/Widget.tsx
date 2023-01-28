import { Box, Icon, IconButton } from '@chakra-ui/react';
import Icons from '~/common/helpers/Icons';

export const Widget = ({
    isEditMode,
    remove,
    children,
}: {
    isEditMode: boolean;
    remove: () => void;
    children: any;
}) => {
    return (
        <Box
            borderRadius='xl'
            borderColor={'gray.200'}
            borderWidth='2px'
            p='2'
            display='flex'
            justifyContent='center'
            alignItems={'center'}
            height={'100%'}
            position={'relative'}
            bg={'gray.50'}
        >
            {isEditMode && (
                <IconButton
                    icon={<Icon as={Icons.Cross} />}
                    aria-label={'remove widget'}
                    top={'0'}
                    position={'absolute'}
                    right={'0'}
                    size={'sm'}
                    variant={'ghost'}
                    onClick={remove}
                    onDragStart={(e) => e.stopPropagation()}
                />
            )}
            {children}
        </Box>
    );
};
