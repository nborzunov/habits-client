import { useEditHabit } from '@entities/habit';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { handleError, handleSuccess } from '@shared/lib';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { createHabitInitialState } from '../const/const';
import { HabitForm } from './HabitForm';

type Props = {};

const EditHabitDialog = createDialog(() => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useEditHabitDialog();

    const { mutate: editHabit } = useEditHabit({
        onSuccess: () => {
            handleSuccess({
                description: 'habits:successfullyEditd',
            });

            dialog.hide();
            queryClient.invalidateQueries(['habits']);
        },
        onError: handleError,
    });

    return (
        <HabitForm
            actionButtonLabel={t('common:Edit')}
            headerTitleLabel={t('habits:EditNewHabit')}
            initialState={createHabitInitialState}
            onSubmit={editHabit as any}
            dialog={dialog}
        />
    );
});

export const openEditHabitDialog = (props: Props) =>
    openDialog(EditHabitDialog, {
        id: 'EditHabit',
        ...props,
    });

export const useEditHabitDialog = () => useDialog(EditHabitDialog);
