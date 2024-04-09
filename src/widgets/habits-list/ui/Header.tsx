import { Button, Flex, Heading, Icon, IconButton, useDisclosure } from '@chakra-ui/react';
import { useCreateHabit } from '@entities/habit';
import { EditHabitDialog } from '@features/edit-habit-dialog';
import { Icons$ } from '@shared/lib';
import { MobileMenu } from '@shared/ui/Layout/MobileMenu';
import { useTranslation } from 'react-i18next';

export const Header = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation();

    const { mutate: createHabit } = useCreateHabit(onClose);
    return (
        <>
            <Flex justifyContent='space-between' alignItems='center' p={4}>
                <Flex alignItems={'center'}>
                    <MobileMenu />
                    <Heading as='h3' size='md'>
                        {t('habits:allHabits')}
                    </Heading>
                </Flex>

                <Flex gap={2}>
                    <Button colorScheme='blue' variant='solid' size='sm' onClick={onOpen}>
                        <Icon as={Icons$.Add} fontSize={'20px'} /> {t('habits:addHabit')}
                    </Button>
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
            <EditHabitDialog onSubmit={createHabit} isOpen={isOpen} onClose={onClose} createMode />
        </>
    );
};
