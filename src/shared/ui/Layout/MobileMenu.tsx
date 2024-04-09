import { LayoutContext } from '@app/layouts/Layout';
import { Icon, IconButton } from '@chakra-ui/react';
import { useMobile } from '@shared/hooks';
import { Icons$ } from '@shared/lib';
import { useContext } from 'react';

export const MobileMenu = () => {
    const { onOpenMenu } = useContext(LayoutContext);
    const isMobile = useMobile();

    return (
        <>
            {isMobile && (
                <IconButton
                    icon={<Icon as={Icons$.Menu} />}
                    aria-label={'menu'}
                    onClick={onOpenMenu}
                    mr={2}
                    colorScheme={'purple'}
                    variant={'outline'}
                    cursor={'pointer'}
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                />
            )}
        </>
    );
};
