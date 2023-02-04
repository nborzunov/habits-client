import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    HStack,
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
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import validationRules from '~/common/helpers/validationRules';
import { GoalType, HabitData, Periodicity } from '~/modules/Habits/types';
import FormField from '~/ui/FormField';
import NumericInput from '~/ui/NumericInput';

const defaultState = {
    title: '',
    goal: 1,
    goalType: GoalType.Times,
    periodicity: Periodicity.Daily,
    allowSkip: false,
    allowPartialCompletion: false,
    allowOverGoalCompletion: false,
};
export const EditHabitDialog = ({
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
    const [form, setForm] = useState(defaultState);

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

    const setInitialState = useCallback(() => {
        setForm({
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
    }, [initialState]);

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm({
        mode: 'all',
        defaultValues: {
            title: initialState?.title ?? defaultState.title,
        },
    });

    const onFormSubmit = (data: { title: string }) => {
        onSubmit({
            ...form,
            title: data.title,
        });
    };

    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) setInitialState();
    }, [isOpen, setInitialState]);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>
                    {initialState
                        ? t('habits:editHabit', {
                              title: initialState.title,
                          })
                        : t('habits:newHabit')}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <FormField
                            label={t('habits:title')}
                            validationProps={register('title', validationRules.text(2))}
                            validationError={errors.title}
                            field={'title'}
                            direction={'column'}
                            variant={'outline'}
                            isRequired
                        />

                        <HStack spacing={3}>
                            <Tooltip label={t('habits:dailyGoal')} hasArrow>
                                <Box>
                                    <NumericInput
                                        min={form.allowPartialCompletion ? 2 : 1}
                                        value={form.goal}
                                        onChange={(e) =>
                                            setValue(
                                                'goal',
                                                !Number.isNaN(Number(e)) ? Number(e) : 1,
                                            )
                                        }
                                    />
                                </Box>
                            </Tooltip>

                            <Tooltip label={t('habits:goalType')} hasArrow>
                                <Select
                                    value={form.goalType}
                                    onChange={(e) =>
                                        setValue('goalType', e.target.value as GoalType)
                                    }
                                    size={{
                                        base: 'md',
                                        sm: 'sm',
                                    }}
                                >
                                    <option value={GoalType.Times}>{t('habits:timesTitle')}</option>
                                    <option value={GoalType.Mins}>
                                        {t('habits:minutesTitle')}
                                    </option>
                                </Select>
                            </Tooltip>

                            <Tooltip label={t('habits:periodicity')} hasArrow>
                                <Select
                                    value={form.periodicity}
                                    onChange={(e) =>
                                        setValue('periodicity', e.target.value as Periodicity)
                                    }
                                    size={{
                                        base: 'md',
                                        sm: 'sm',
                                    }}
                                >
                                    {Object.values(Periodicity).map((key) => (
                                        <option key={key} value={key}>
                                            {t(`habits:periodicityOptions.${key}`)}
                                        </option>
                                    ))}
                                </Select>
                            </Tooltip>
                        </HStack>

                        <Text mb={2} fontWeight={'semibold'}>
                            {t('common:additional')}
                        </Text>

                        <FormControl>
                            <Checkbox
                                isChecked={form.allowOverGoalCompletion}
                                onChange={(e) =>
                                    setValue('allowOverGoalCompletion', e.target.checked)
                                }
                            >
                                {t('habits:allowOverGoal')}
                            </Checkbox>
                        </FormControl>

                        <Tooltip label={t('habits.increaseDailyGoal')} isDisabled={form.goal > 1}>
                            <FormControl isDisabled={form.goal <= 1}>
                                <Checkbox
                                    isChecked={form.allowPartialCompletion}
                                    onChange={(e) =>
                                        setValue('allowPartialCompletion', e.target.checked)
                                    }
                                >
                                    {t('habits:allowPartial')}
                                </Checkbox>
                            </FormControl>
                        </Tooltip>

                        <FormControl>
                            <Checkbox
                                isChecked={form.allowSkip}
                                onChange={(e) => setValue('allowSkip', e.target.checked)}
                            >
                                {t('habits:allowSkip')}
                            </Checkbox>

                            <FormHelperText>{t('habits:allowSkipDescription')}</FormHelperText>
                        </FormControl>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='blue'
                        mr={3}
                        size={{
                            base: 'md',
                            sm: 'sm',
                        }}
                        onClick={onClose}
                    >
                        {t('common:close')}
                    </Button>
                    <Button
                        colorScheme='green'
                        type='submit'
                        size={{
                            base: 'md',
                            sm: 'sm',
                        }}
                        isLoading={isSubmitting}
                    >
                        {initialState ? t('common:update') : t('common:create')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
