import { useQuery } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import { Account } from '~/modules/Finance/types';

export const useAccounts = () => {
    return useQuery<Account[]>({
        queryKey: ['accounts'],
        queryFn: () =>
            api
                .get('finance/account')
                .json<Account[]>()
                .then((a) => {
                    console.log(a);
                    return a;
                }),
        initialData: [],
        refetchInterval: 1000 * 60 * 10,
        refetchIntervalInBackground: true,
    });
};
