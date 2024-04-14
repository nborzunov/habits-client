import { Button, Flex, Heading, Icon, IconButton } from '@chakra-ui/react';
import { HabitData, useCreateHabit } from '@entities/habit';
import { useEditHabitDialog } from '@features/edit-habit-dialog';
import { Icons$ } from '@shared/lib';
import { MobileMenu } from '@shared/ui/Layout/MobileMenu';
import { useTranslation } from 'react-i18next';

export const Header = () => {
    const { t } = useTranslation();

    const editHabitDialog = useEditHabitDialog();
    const { mutate: createHabit } = useCreateHabit(editHabitDialog.hide);

    const onOpenCreateHabitDialog = () =>
        editHabitDialog
            .show({
                createMode: true,
            })
            .then((h: HabitData) => createHabit(h));
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
                    <Button
                        colorScheme='blue'
                        variant='solid'
                        size='sm'
                        onClick={onOpenCreateHabitDialog}
                    >
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
        </>
    );
};
