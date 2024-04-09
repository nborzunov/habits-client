import { Box, Button, Heading, Stack, useDisclosure } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { useCleanHabits } from '@entities/habit';
import { useDeleteHabits } from '@entities/habit/api/useDeleteHabits';
import { useTitle } from '@shared/hooks';
import { ConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

export const CleanData = () => {
    const user = useRecoilValue(activeUserState);
    const { t } = useTranslation();
    useTitle(`${user?.name} ${user?.surname} - ${t('common:cleanData')}`);

    const {
        isOpen: isOpenCleanConfirm,
        onOpen: onOpenCleanConfirm,
        onClose: onCloseCleanConfirm,
    } = useDisclosure();
    const {
        isOpen: isOpenDeleteConfirm,
        onOpen: onOpenDeleteConfirm,
        onClose: onCloseDeleteConfirm,
    } = useDisclosure();

    const { mutate: cleanHabits } = useCleanHabits(onCloseCleanConfirm);
    const { mutate: deleteHabits } = useDeleteHabits(onCloseDeleteConfirm);

    const cancelRef = useRef();

    return (
        <>
            <ConfirmationDialog
                isOpen={isOpenCleanConfirm}
                onClose={onOpenCleanConfirm}
                cancelRef={cancelRef}
                title={t('profile:cleanData')}
                text={t('common:confirmText')}
            >
                <Button
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                    onClick={onCloseCleanConfirm}
                >
                    {t('common:cancel')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                    colorScheme='red'
                    onClick={() => cleanHabits()}
                    ml={3}
                >
                    {t('common:clean')}
                </Button>
            </ConfirmationDialog>
            <ConfirmationDialog
                isOpen={isOpenDeleteConfirm}
                onClose={onCloseDeleteConfirm}
                cancelRef={cancelRef}
                title={t('profile:delete')}
                text={t('common:confirmText')}
            >
                <Button
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                    onClick={onCloseDeleteConfirm}
                >
                    {t('common:cancel')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'md',
                    }}
                    colorScheme='red'
                    onClick={() => deleteHabits()}
                    ml={3}
                >
                    {t('common:delete')}
                </Button>
            </ConfirmationDialog>

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
                        onClick={onOpenCleanConfirm}
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
                        onClick={onOpenDeleteConfirm}
                        colorScheme={'purple'}
                        px={'4'}
                    >
                        {t('profile:deleteAllHabits')}
                    </Button>
                </Stack>
            </Box>
        </>
    );
};
