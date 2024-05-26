import { useCreateHabit } from '@entities/habit';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { handleError, handleSuccess } from '@shared/lib';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { createHabitInitialState } from '../const/const';
import { HabitForm } from './HabitForm';

type Props = {};

const CreateHabitDialog = createDialog(() => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useCreateHabitDialog();

    const { mutate: createHabit } = useCreateHabit({
        onSuccess: () => {
            handleSuccess({
                description: 'habits:successfullyCreated',
            });

            dialog.hide();
            queryClient.invalidateQueries(['habits']);
        },
        onError: handleError,
    });

    return (
        <HabitForm
            actionButtonLabel={t('common:create')}
            headerTitleLabel={t('habits:createNewHabit')}
            initialState={createHabitInitialState}
            onSubmit={createHabit}
            dialog={dialog}
        />
    );
});

export const openCreateHabitDialog = (props: Props) =>
    openDialog(CreateHabitDialog, {
        id: 'CreateHabit',
        ...props,
    });

export const useCreateHabitDialog = () => useDialog(CreateHabitDialog);
