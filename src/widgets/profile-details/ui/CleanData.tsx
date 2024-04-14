import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { useCleanHabits, useDeleteHabits } from '@entities/habit';
import { useTitle } from '@shared/hooks';
import { openConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

export const CleanData = () => {
    const user = useRecoilValue(activeUserState);
    const { t } = useTranslation();
    useTitle(`${user?.name} ${user?.surname} - ${t('common:cleanData')}`);

    const { mutate: cleanHabits } = useCleanHabits();
    const { mutate: deleteHabits } = useDeleteHabits();

    const onCleanHabits = () => {
        openConfirmationDialog({
            title: t('profile:cleanData'),
            text: t('common:confirmText'),
            cancelText: t('common:cancel'),
            okText: t('common:clean'),
        }).then(() => cleanHabits());
    };

    const onDeleteHabits = () => {
        openConfirmationDialog({
            title: t('common:delete'),
            text: t('common:confirmText'),
            cancelText: t('common:cancel'),
            okText: t('common:delete'),
        }).then(() => deleteHabits());
    };
    return (
        <>
            <Box>
                <Heading as='h3' size='md' mb={'6'}>
                    {t('common:cleanData')}
                </Heading>

                <Stack width={'230px'}>
                    <Button
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={onCleanHabits}
                        colorScheme={'purple'}
                        px={'4'}
                    >
                        {t('profile:cleanAllHabits')}
                    </Button>
                    <Button
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={onDeleteHabits}
                        colorScheme={'purple'}
                        px={'4'}
                    >
                        {t('common:deleteAllHabits')}
                    </Button>
                </Stack>
            </Box>
        </>
    );
};
