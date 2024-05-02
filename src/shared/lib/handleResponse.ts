import { t } from 'i18next';

export const handleSuccess = (params: { toast: any; title?: string; description: string }) => {
    params.toast({
        title: t(params.title || 'common:success'),
        description: t(params.description),
        status: 'success',
        duration: 1000,
        isClosable: true,
    });
};

export const handleError = (params: { toast: any; err: any }) => {
    params.toast({
        title: t('common:error'),
        description:
            params.err.status === 401 ? t('common:invalidCredentials') : t('common:serverError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
    });
};
