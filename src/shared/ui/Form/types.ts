export type FieldConfig<T> = {
    field: T;
    label: string;
    validationProps: any;
};
export type FieldsConfig<T> = Array<FieldConfig<T>>;

export type FieldsConfigObj<T extends string> = {
    [key in T]: FieldConfig<T>;
};

export interface FormFieldProps {
    field: string;
    label: string;
    initialValue?: string;
    value?: string;
    validationError: any;
    validationProps: any;
    hideResetButton: boolean;
    isRequired: boolean;
    minWidth: string | any;
    resetValue?: () => void;
    direction: 'row' | 'column';
    variant: 'outline' | 'filled';
    showPasswordIcon: boolean;
    type?: string;
}
