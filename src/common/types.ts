export type SetError<T extends string> = (
    field: T,
    error: {
        type: 'custom';
        message: string;
    },
) => void;
