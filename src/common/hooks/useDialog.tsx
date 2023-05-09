import { useDisclosure } from '@chakra-ui/react';
import {
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

interface DialogState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

interface DialogContextType {
    dialogs: Record<string, DialogState>;
    setDialogs: Dispatch<SetStateAction<Record<string, DialogState>>>;
}

const DialogContext = createContext<DialogContextType>({
    dialogs: {},
    setDialogs: () => '',
});

interface DialogProviderProps {
    children: ReactNode;
}

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
    const [dialogs, setDialogs] = useState<Record<string, DialogState>>({});

    return (
        <DialogContext.Provider value={{ dialogs, setDialogs }}>{children}</DialogContext.Provider>
    );
};

const useDialogContext = () => useContext(DialogContext);

interface UseDialogState {
    (dialogId: string, isOpenDefault?: boolean): DialogState;
}

export const useDialog: UseDialogState = (dialogId, isOpenDefault = false) => {
    const { dialogs, setDialogs } = useDialogContext();
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: isOpenDefault });

    useEffect(() => {
        if (!dialogs[dialogId]) {
            setDialogs((prevDialogs) => ({
                ...prevDialogs,
                [dialogId]: { isOpen, onOpen, onClose },
            }));
        }
    }, [isOpen, onOpen, onClose, dialogId, setDialogs, dialogs]);

    useEffect(() => {
        setDialogs((prevDialogs) => ({
            ...prevDialogs,
            [dialogId]: { isOpen, onOpen, onClose },
        }));
    }, [isOpen, onOpen, onClose, setDialogs, dialogId]);

    return dialogs[dialogId] || { isOpen: false };
};
