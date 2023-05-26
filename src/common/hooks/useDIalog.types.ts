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
