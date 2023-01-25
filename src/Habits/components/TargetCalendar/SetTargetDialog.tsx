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
import NumericInput from '~/common/components/NumericInput';
import { useState } from 'react';
import { Habit } from '~/Habits/types';

interface Props {
    habit: Habit;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: number) => void;
}

const SetTargetDialog = ({ habit, isOpen, onClose, onSubmit }: Props) => {
    const [result, setResult] = useState(1);

    const handleSubmit = () => {
        onSubmit(result);
        setResult(1);
        onClose();
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
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

export default SetTargetDialog;
