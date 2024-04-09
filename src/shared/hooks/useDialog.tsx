import { useDisclosure } from '@chakra-ui/react';
import { ComponentType, ReactElement, createContext, useContext, useState } from 'react';

export function createDialogProvider<T>(DialogComponent: ComponentType<DialogProps<T>>) {
    const DialogContext = createContext<DialogContextProps<T>>({
        onOpen: () => {},
        onClose: () => {},
        isOpen: false,
    } as DialogContextProps<T>);

    const DialogProvider = ({ children }: { children: ReactElement }) => {
        const { isOpen, onOpen, onClose } = useDisclosure();

        const open = (props: T) => {
            onOpen();
            setDialogConfig(props);
        };

        const close = () => {
            onClose();
            setTimeout(() => {
                setDialogConfig({} as T);
            }, 300);
        };

        const [dialogConfig, setDialogConfig] = useState<T>({} as T);

        return (
            <DialogContext.Provider
                value={{ onOpen: open, isOpen, onClose: close } as DialogContextProps<T>}
            >
                {children}
                <DialogComponent isOpen={isOpen} onClose={close} {...dialogConfig} />
            </DialogContext.Provider>
        );
    };

    function useDialogAction() {
        return useContext(DialogContext);
    }

    return { DialogProvider, useDialogAction };
}

export interface DefaultDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export type DialogProps<T> = DefaultDialogProps & T;

export type DialogContextProps<T = {}> = {
    onOpen: T extends {} ? (props: T) => void : () => void;
    onClose: () => void;
    isOpen: boolean;
};
