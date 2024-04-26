import NiceModal, { useModal as useNiceModal } from '@ebay/nice-modal-react';

export const openDialog = NiceModal.show as unknown as <T extends {}>(
    component: React.FC<T> | string,
    props: T,
) => Promise<any>;

export const createDialog = NiceModal.create;

export const useDialog = (props: any) => {
    const dialog = useNiceModal(props);

    const resolve = (data: any) => {
        dialog.resolve(data);
        dialog.hide();
    };
    const reject = () => {
        dialog.reject(new Error('Rejected'));
        dialog.hide();
    };

    return {
        ...dialog,
        resolve,
        reject,
        show: dialog.show as unknown as <T extends {}>(props: T) => Promise<any>,
    };
};
