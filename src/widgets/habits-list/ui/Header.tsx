import { Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { Icons$ } from '@shared/lib';
import { MobileMenu } from '@shared/ui/Layout/MobileMenu';
import { useTranslation } from 'react-i18next';

export const Header = () => {
    const { t } = useTranslation();

    return (
        <>
            <Flex justify='space-between' align='center' p={4}>
                <Flex align={'center'}>
                    <MobileMenu />
                    <Heading as='h3' size='md'>
                        {t('habits:allHabits')}
                    </Heading>
                </Flex>

                <Flex gap={2}>
                    <IconButton
                        icon={<Icon as={Icons$.Settings} />}
                        aria-label={'settings'}
                        colorScheme='blue'
                        variant='solid'
                        size='sm'
                        onClick={() => alert('TODO')}
                    />
                </Flex>
            </Flex>
        </>
    );
};
