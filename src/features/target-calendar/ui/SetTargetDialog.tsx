import {
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { Habit, Target } from '@entities/habit';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { NumericInput } from '@shared/ui/Form/NumericInput';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    habit: Habit;
    target?: Target;
    onSubmit: (value: number) => void;
}

export const SetTargetDialog = createDialog(({ target, habit, onSubmit }: Props) => {
    const [result, setResult] = useState(target?.value ?? 1);

    const dialog = useSetTargetDialog();
    const handleClose = useCallback(() => {
        setResult(1);
        dialog.hide();
    }, [dialog]);

    const { t } = useTranslation();

    const handleSubmit = useCallback(() => {
        onSubmit(result);
        handleClose();
    }, [onSubmit, handleClose, result]);
    return (
        <Modal isOpen={dialog.visible} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent mx={4}>
                <ModalHeader>{t('habits:setResult', { title: habit.title })}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel htmlFor='result'>{t('common:result')}</FormLabel>
                        <NumericInput
                            value={result}
                            onChange={(v) => setResult(v)}
                            min={1}
                            max={
                                habit.allow_over_goal_completion
                                    ? Number.MAX_SAFE_INTEGER
                                    : habit.goal
                            }
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='purple'
                        width={'100%'}
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={handleSubmit}
                    >
                        {t('habits:operations.set')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});

SetTargetDialog.displayName = 'SetTargetDialog';

export const openSetTargetDialog = (props: Props) =>
    openDialog(SetTargetDialog, {
        id: 'SetTarget',
        ...props,
    });

export const useSetTargetDialog = () => useDialog(SetTargetDialog);
