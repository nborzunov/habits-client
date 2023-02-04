import { Box, Button, Heading, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState, habitsState } from '~/common/store/atoms';
import ConfirmationDialog from '~/ui/ConfirmationDialog';

export const CleanData = () => {
    const user = useRecoilValue(activeUserState);
    const toast = useToast();
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    useTitle(`${user?.name} ${user?.surname} - ${t('common:cleanData')}`);

    const cleanHabits = useMutation({
        mutationFn: () => {
            return api
                .post(`habits/clean`)
                .then(() =>
                    setHabits((prev) =>
                        prev.map((h) => ({
                            ...h,
                            targets: [],
                        })),
                    ),
                )
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyCleaned.one'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch(() => {
                    toast({
                        title: t('common:error'),
                        description: t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                })
                .finally(() => onCloseCleanConfirm());
        },
    });

    const deleteHabits = useMutation({
        mutationFn: () => {
            return api
                .delete(`habits/`)
                .then(() => setHabits([]))
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyDeleted'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch(() => {
                    toast({
                        title: t('common:error'),
                        description: t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                })
                .finally(() => onCloseDeleteConfirm());
        },
    });

    const handleCleanData = () => {
        cleanHabits.mutate();
    };

    const handleDeleteHabits = () => {
        deleteHabits.mutate();
    };

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
                        sm: 'sm',
                    }}
                    onClick={onCloseCleanConfirm}
                >
                    {t('common:cancel')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    colorScheme='red'
                    onClick={handleCleanData}
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
                        sm: 'sm',
                    }}
                    onClick={onCloseDeleteConfirm}
                >
                    {t('common:cancel')}
                </Button>
                <Button
                    size={{
                        base: 'md',
                        sm: 'sm',
                    }}
                    colorScheme='red'
                    onClick={handleDeleteHabits}
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
                            sm: 'sm',
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
                            sm: 'sm',
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
