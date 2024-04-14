import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import React, { useRef } from 'react';

interface Props {
    title: string;
    text: string;
    okText?: any;
    cancelText?: any;
    customFooter?: (ok: (callback: () => void) => void, cancel: () => void) => React.ReactNode;
}

const ConfirmationDialog = createDialog(
    ({ title, text, okText, cancelText, customFooter }: Props) => {
        const dialog = useDialog(ConfirmationDialog);

        const cancelRef = useRef<any>();

        return (
            <AlertDialog
                isOpen={dialog.visible}
                onClose={dialog.reject}
                leastDestructiveRef={cancelRef}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent mx={4}>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {title}
                        </AlertDialogHeader>

                        <AlertDialogBody whiteSpace={'pre-wrap'}>{text}</AlertDialogBody>

                        <AlertDialogFooter>
                            {customFooter && customFooter(dialog.resolve, dialog.reject)}
                            {!customFooter && (
                                <>
                                    <Button
                                        size={{
                                            base: 'md',
                                            sm: 'md',
                                        }}
                                        onClick={dialog.reject}
                                    >
                                        {cancelText}
                                    </Button>
                                    <Button
                                        size={{
                                            base: 'md',
                                            sm: 'md',
                                        }}
                                        colorScheme='red'
                                        onClick={dialog.resolve}
                                        ml={3}
                                    >
                                        {okText}
                                    </Button>
                                </>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        );
    },
);

ConfirmationDialog.defaultProps = {
    okText: 'OK',
    cancelText: 'Cancel',
};

export const openConfirmationDialog = (props: Props) =>
    openDialog(ConfirmationDialog, {
        id: 'ConfirmationDialog',
        ...props,
    });
