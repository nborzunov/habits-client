import { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Stack,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { GoalType, HabitData, Periodicity } from '~/Habits/types';
import NumericInput from '~/common/components/NumericInput';

const defaultState = {
    title: '',
    goal: 1,
    goalType: GoalType.Times,
    periodicity: Periodicity.Daily,
    allowSkip: false,
    allowPartialCompletion: false,
    allowOverGoalCompletion: false,
};
const EditHabitDialog = ({
    isOpen,
    onClose,
    initialState,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    initialState?: HabitData;
    onSubmit: (h: HabitData) => void;
}) => {
    const [form, setForm] = useState({
        title: initialState?.title ?? defaultState.title,
        goal: initialState?.goal ?? defaultState.goal,
        goalType: initialState?.goalType ?? defaultState.goalType,
        periodicity: initialState?.periodicity ?? defaultState.periodicity,
        allowSkip: initialState?.allowSkip ?? defaultState.allowSkip,
        allowPartialCompletion:
            initialState?.allowPartialCompletion ?? defaultState.allowPartialCompletion,
        allowOverGoalCompletion:
            initialState?.allowOverGoalCompletion ?? defaultState.allowPartialCompletion,
    });

    const handleSubmit = () => {
        onSubmit(form);
        setForm(defaultState);
    };

    const handleChangeTitle = (value: string) => {
        setValue('title', value.charAt(0).toUpperCase() + value.slice(1));
    };

    const setValue = useCallback((field: string, value: string | boolean | number) => {
        setForm((form) => ({
            ...form,
            [field]: value,
        }));
    }, []);

    useEffect(() => {
        if (form.goal <= 1 && form.allowPartialCompletion) {
            setValue('allowPartialCompletion', false);
        }
    }, [form.goal, form.allowPartialCompletion, setValue]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {initialState ? `Edit Habit "${initialState.title}"` : 'New Habit'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input
                                type='text'
                                value={form.title}
                                onChange={(e) => handleChangeTitle(e.target.value)}
                            />
                        </FormControl>

                        <HStack spacing={3}>
                            <Tooltip label={'Daily Goal'} hasArrow>
                                <NumericInput
                                    min={form.allowPartialCompletion ? 2 : 1}
                                    value={form.goal}
                                    onChange={(e) =>
                                        setValue('goal', !Number.isNaN(Number(e)) ? Number(e) : 1)
                                    }
                                />
                            </Tooltip>

                            <Tooltip label={'Goal Type'} hasArrow>
                                <Select
                                    value={form.goalType}
                                    onChange={(e) =>
                                        setValue('goalType', e.target.value as GoalType)
                                    }
                                >
                                    <option value={GoalType.Times}>Times</option>
                                    <option value={GoalType.Mins}>Mins</option>
                                </Select>
                            </Tooltip>

                            <Tooltip label={'Periodicity'} hasArrow>
                                <Select
                                    value={form.periodicity}
                                    onChange={(e) =>
                                        setValue('periodicity', e.target.value as Periodicity)
                                    }
                                >
                                    <option value={Periodicity.Daily}>Per Day</option>
                                    <option value={Periodicity.Weekly}>Per Week</option>
                                    <option value={Periodicity.Monthly}>Per Month</option>
                                    <option value={Periodicity.Custom}>Custom</option>
                                </Select>
                            </Tooltip>
                        </HStack>

                        <Text mb={2} fontWeight={'semibold'}>
                            Additional
                        </Text>

                        <FormControl>
                            <Checkbox
                                isChecked={form.allowOverGoalCompletion}
                                onChange={(e) =>
                                    setValue('allowOverGoalCompletion', e.target.checked)
                                }
                            >
                                Allow overgoal completion
                            </Checkbox>
                        </FormControl>

                        <Tooltip
                            label={'Please increase your daily goal'}
                            isDisabled={form.goal > 1}
                        >
                            <FormControl isDisabled={form.goal <= 1}>
                                <Checkbox
                                    isChecked={form.allowPartialCompletion}
                                    onChange={(e) =>
                                        setValue('allowPartialCompletion', e.target.checked)
                                    }
                                >
                                    Allow partial completion
                                </Checkbox>
                            </FormControl>
                        </Tooltip>

                        <FormControl>
                            <Checkbox
                                isChecked={form.allowSkip}
                                onChange={(e) => setValue('allowSkip', e.target.checked)}
                            >
                                Allow skip specific days
                            </Checkbox>

                            <FormHelperText>(e.g. if you need some time to rest)</FormHelperText>
                        </FormControl>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme='green' onClick={handleSubmit}>
                        {initialState ? 'Update' : 'Create'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditHabitDialog;
