export const validationRules = {
    password: () => ({
        required: { value: true, message: 'profile:password.currentPassword.required' },
        minLength: { value: 8, message: 'profile:password.errors.minLength' },
    }),
    newPassword: () => ({
        required: { value: true, message: 'profile:password.password.required' },
        minLength: { value: 8, message: 'profile:password.errors.minLength' },
        pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: 'profile:password.newPassword.format',
        },
    }),
    newPasswordConfirm: () => ({
        required: { value: true, message: 'profile:password.repeatPassword.required' },
        minLength: { value: 8, message: 'profile:password.errors.minLength' },
        pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            message: 'profile:password.newPassword.format',
        },
    }),
    required: (requiredMessage: string) => ({
        required: { message: requiredMessage || 'profile:field.required' },
    }),
    text: ({
        minLength,
        requiredMessage,
        minLengthMessage,
    }: {
        minLength: number;
        requiredMessage?: string;
        minLengthMessage?: string;
    }) => ({
        required: requiredMessage || 'profile:field.required',
        minLength: {
            value: minLength,
            message: minLengthMessage || `profile:field.minLength.${minLength}`,
        },
    }),
    longText: () => ({
        maxLength: { value: 250, message: 'profile:field.maxLength' },
    }),
    email: () => ({
        required: 'profile:field.required',
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'profile:email.invalid',
        },
    }),
};
