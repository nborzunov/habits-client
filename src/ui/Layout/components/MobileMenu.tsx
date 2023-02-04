import { Icon, IconButton } from '@chakra-ui/react';
import { useContext } from 'react';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';
import { LayoutContext } from '~/ui/Layout/components/Layout';

export const MobileMenu = () => {
    const { onOpenMenu } = useContext(LayoutContext);
    const isMobile = useMobile();

    return (
        <>
            {isMobile && (
                <IconButton
                    icon={<Icon as={Icons.Menu} />}
                    aria-label={'menu'}
                    onClick={onOpenMenu}
                    mr={2}
                    colorScheme={'purple'}
                    variant={'outline'}
                    cursor={'pointer'}
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                />
            )}
        </>
    );
};
