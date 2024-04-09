import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
} from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text: string;
    cancelRef: any;
}

export const ConfirmationDialog = ({
    isOpen,
    onClose,
    cancelRef,
    title,
    text,
    children,
}: PropsWithChildren<Props>) => {
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
            <AlertDialogOverlay>
                <AlertDialogContent mx={4}>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>{text}</AlertDialogBody>

                    <AlertDialogFooter>{children}</AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
