export const processError = <T,>(
    t: any,
    err: any,
    onServerError: (errorMessage: string) => void,
    onFormError: (field: T, message: string) => void,
): void => {
    if (!err.response?.data?.field) {
        onServerError(err.response?.data?.message || t('common:serverError'));
        return;
    }

    const { field, message } = err.response.data;

    onFormError(field, message);
};
