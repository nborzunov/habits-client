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
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{habit.title} - Set Today&apos;s Result</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel htmlFor='result'>Result</FormLabel>
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
                    <Button colorScheme='purple' width={'100%'} onClick={handleSubmit}>
                        {'Set'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
