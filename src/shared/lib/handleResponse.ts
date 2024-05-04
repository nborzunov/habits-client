import { toast } from '@shared/const/toast';
import { t } from 'i18next';

export const handleSuccess = (params: { title?: string; description: string }) => {
    toast({
        title: t(params.title || 'common:success'),
        description: t(params.description),
        status: 'success',
        duration: 1000,
        isClosable: true,
    });
};

export const handleError = (err: any) => {
    toast({
        title: t('common:error'),
        description: err.status === 401 ? t('common:invalidCredentials') : t('common:serverError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
    });
};
