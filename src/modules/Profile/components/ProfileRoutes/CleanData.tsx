import { Box, Button, Heading, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState, habitsState } from '~/common/store/atoms';
import ConfirmationDialog from '~/ui/ConfirmationDialog';

export const CleanData = () => {
    const user = useRecoilValue(activeUserState);
    useTitle(`${user?.name} ${user?.surname} - Clean Data`);

    const toast = useToast();

    const setHabits = useSetRecoilState(habitsState);

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
                        title: 'Success',
                        description: 'Habits data cleaned!',
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch(() => {
                    toast({
                        title: 'Error',
                        description: 'Something went wrong',
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
                        title: 'Success',
                        description: 'Habits deleted!',
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch(() => {
                    toast({
                        title: 'Error',
                        description: 'Something went wrong',
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
                title={'Confirm Clean Operation'}
                text={"Are you sure? You can't undo this action."}
            >
                <Button onClick={onCloseCleanConfirm}>Cancel</Button>
                <Button colorScheme='red' onClick={handleCleanData} ml={3}>
                    Clean
                </Button>
            </ConfirmationDialog>
            <ConfirmationDialog
                isOpen={isOpenDeleteConfirm}
                onClose={onCloseDeleteConfirm}
                cancelRef={cancelRef}
                title={'Confirm Delete Operation'}
                text={"Are you sure? You can't undo this action."}
            >
                <Button onClick={onCloseDeleteConfirm}>Cancel</Button>
                <Button colorScheme='red' onClick={handleDeleteHabits} ml={3}>
                    Clean
                </Button>
            </ConfirmationDialog>

            <Box>
                <Heading as='h3' size='md' mb={'6'}>
                    Clean Data
                </Heading>

                <Stack width={'230px'}>
                    <Button onClick={onOpenCleanConfirm} colorScheme={'purple'} px={'4'}>
                        Clean All Habits Targets
                    </Button>
                    <Button onClick={onOpenDeleteConfirm} colorScheme={'purple'} px={'4'}>
                        Delete All Habits
                    </Button>
                </Stack>
            </Box>
        </>
    );
};
