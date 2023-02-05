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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Habit, Target } from '~/modules/Habits/types';
import NumericInput from '~/ui/NumericInput';

interface Props {
    habit: Habit;
    target?: Target;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: number) => void;
}

export const SetTargetDialog = ({ target, habit, isOpen, onClose, onSubmit }: Props) => {
    const [result, setResult] = useState(target?.value ?? 1);

    const handleSubmit = () => {
        onSubmit(result);
        handleClose();
    };

    const handleClose = () => {
        setResult(1);
        onClose();
    };
    const { t } = useTranslation();
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
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
                                habit.allowOverGoalCompletion ? Number.MAX_SAFE_INTEGER : habit.goal
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
};
