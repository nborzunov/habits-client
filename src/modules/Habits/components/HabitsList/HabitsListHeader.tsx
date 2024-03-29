import { Button, Flex, Heading, Icon, IconButton, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { useCreateHabit } from '~/modules/Habits/api/useCreateHabit';
import { EditHabitDialog } from '~/modules/Habits/components/HabitDetails';
import { MobileMenu } from '~/ui/Layout/components/MobileMenu';

export const HabitsListHeader = () => {
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
                        <Icon as={Icons.Add} fontSize={'20px'} /> {t('habits:addHabit')}
                    </Button>
                    <IconButton
                        icon={<Icon as={Icons.Settings} />}
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
