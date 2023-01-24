const processError = <T,>(
    err: any,
    onServerError: (errorMessage: string) => void,
    onFormError: (field: T, message: string) => void,
): void => {
    if (!err.response?.data?.field) {
        onServerError(err.response.data?.message || 'Something went wrong');
        return;
    }

    const { field, message } = err.response.data;

    onFormError(field, message);
};

export default processError;
