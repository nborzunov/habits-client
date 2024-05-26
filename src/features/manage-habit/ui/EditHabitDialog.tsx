import {
    Box,
    Button,
    Checkbox,
    Flex,
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
import { FrequencyType, GoalType, HabitData } from '@entities/habit';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { FormField } from '@shared/ui/Form';
import { NumericInput } from '@shared/ui/Form/NumericInput';
import { validationRules } from '@shared/ui/Form/validationRules';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const defaultState = {
    title: '',
    goal: 1,
    goal_type: GoalType.Times,
    frequencyType: FrequencyType.Daily,
    allow_skip: false,
    allow_partial_completion: false,
    allow_over_goal_completion: false,
    can_be_finished: false,
    total_goal: 1,
};

type Props = {
    initialState?: HabitData;
    createMode?: boolean;
};
export const EditHabitDialog = createDialog(({ initialState, createMode }: Props) => {
    const dialog = useEditHabitDialog();
    const [form, setForm] = useState(defaultState);

    const setValue = useCallback((field: string, value: string | boolean | number) => {
        setForm((form) => ({
            ...form,
            [field]: value,
        }));
    }, []);

    useEffect(() => {
        if (form.goal <= 1 && form.allow_partial_completion) {
            setValue('allow_partial_completion', false);
        }
    }, [form.goal, form.allow_partial_completion, setValue]);

    const setInitialState = useCallback(() => {
        setForm({
            title: initialState?.title ?? defaultState.title,
            goal: initialState?.goal ?? defaultState.goal,
            goal_type: initialState?.goal_type ?? defaultState.goal_type,
            frequencyType: initialState?.frequencyType ?? defaultState.frequencyType,
            allow_skip: initialState?.allow_skip ?? defaultState.allow_skip,
            allow_partial_completion:
                initialState?.allow_partial_completion ?? defaultState.allow_partial_completion,
            allow_over_goal_completion:
                initialState?.allow_over_goal_completion ?? defaultState.allow_partial_completion,
            can_be_finished: initialState?.can_be_finished ?? defaultState.can_be_finished,
            total_goal: initialState?.total_goal ?? defaultState.total_goal,
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
        dialog.resolve({
            ...form,
            title: data.title,
        });
    };

    const { t } = useTranslation();

    useEffect(() => {
        if (dialog.visible) setInitialState();
    }, [dialog.visible, setInitialState]);
    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide}>
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
                    <Stack spacing={6}>
                        {/* MAIN SETTINGS */}
                        <Stack spacing={3}>
                            <FormField
                                label={t('habits:title')}
                                validationProps={register(
                                    'title',
                                    validationRules.text({
                                        minLength: 2,
                                    }),
                                )}
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
                                            min={form.allow_partial_completion ? 2 : 1}
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

                                <Tooltip label={t('habits:goal_type')} hasArrow>
                                    <Select
                                        value={form.goal_type}
                                        onChange={(e) =>
                                            setValue('goal_type', e.target.value as GoalType)
                                        }
                                        size={{
                                            base: 'md',
                                            sm: 'md',
                                        }}
                                    >
                                        <option value={GoalType.Times}>
                                            {t('habits:timesTitle')}
                                        </option>
                                        <option value={GoalType.Mins}>
                                            {t('habits:minutesTitle')}
                                        </option>
                                    </Select>
                                </Tooltip>

                                <Tooltip label={t('habits:frequencyType')} hasArrow>
                                    <Select
                                        value={form.frequencyType}
                                        onChange={(e) =>
                                            setValue(
                                                'frequencyType',
                                                e.target.value as FrequencyType,
                                            )
                                        }
                                        size={{
                                            base: 'md',
                                            sm: 'md',
                                        }}
                                    >
                                        {Object.values(FrequencyType).map((key) => (
                                            <option key={key} value={key}>
                                                {t(`habits:frequencyTypeOptions.${key}`)}
                                            </option>
                                        ))}
                                    </Select>
                                </Tooltip>
                            </HStack>
                        </Stack>

                        {/* GOAL COMPLETION */}
                        <Stack spacing={3}>
                            <Text fontWeight={'semibold'}>{t('habits:goal')}</Text>

                            <FormControl>
                                <Checkbox
                                    isChecked={form.can_be_finished}
                                    isDisabled={!createMode}
                                    onChange={(e) => setValue('can_be_finished', e.target.checked)}
                                >
                                    {t('habits:can_be_finished')}
                                </Checkbox>
                            </FormControl>

                            <Flex
                                gap={2}
                                direction={'row'}
                                align='center'
                                justify='space-between'
                                color={!createMode || !form.can_be_finished ? 'gray.500' : ''}
                            >
                                <Text whiteSpace={'nowrap'}>{t('habits:finishIf')}</Text>
                                <Tooltip label={t('habits:goal')} hasArrow>
                                    <Box>
                                        <NumericInput
                                            min={form.goal}
                                            isDisabled={!createMode || !form.can_be_finished}
                                            value={form.total_goal}
                                            onChange={(e) =>
                                                setValue(
                                                    'total_goal',
                                                    !Number.isNaN(Number(e)) ? Number(e) : 1,
                                                )
                                            }
                                        />
                                    </Box>
                                </Tooltip>
                                <Text>
                                    {t('common:daysShort', {
                                        count: form.total_goal,
                                    })}
                                </Text>
                            </Flex>
                        </Stack>

                        {/* ADDITIONAL */}
                        <Stack spacing={3}>
                            <Text fontWeight={'semibold'}>{t('common:additional')}</Text>

                            <FormControl>
                                <Checkbox
                                    isChecked={form.allow_over_goal_completion}
                                    onChange={(e) =>
                                        setValue('allow_over_goal_completion', e.target.checked)
                                    }
                                >
                                    {t('habits:allowOverGoal')}
                                </Checkbox>
                            </FormControl>

                            <Tooltip
                                label={t('habits.increaseDailyGoal')}
                                isDisabled={form.goal > 1}
                            >
                                <FormControl isDisabled={form.goal <= 1}>
                                    <Checkbox
                                        isChecked={form.allow_partial_completion}
                                        onChange={(e) =>
                                            setValue('allow_partial_completion', e.target.checked)
                                        }
                                    >
                                        {t('habits:allowPartial')}
                                    </Checkbox>
                                </FormControl>
                            </Tooltip>

                            <FormControl>
                                <Checkbox
                                    isChecked={form.allow_skip}
                                    onChange={(e) => setValue('allow_skip', e.target.checked)}
                                >
                                    {t('habits:allow_skip')}
                                </Checkbox>

                                <FormHelperText>{t('habits:allow_skipDescription')}</FormHelperText>
                            </FormControl>
                        </Stack>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='blue'
                        mr={3}
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={dialog.hide}
                    >
                        {t('common:close')}
                    </Button>
                    <Button
                        colorScheme='green'
                        type='submit'
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        isLoading={isSubmitting}
                    >
                        {initialState ? t('common:update') : t('common:create')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});

export const openEditHabitDialog = (props: Props) =>
    openDialog(EditHabitDialog, {
        id: 'EditHabit',
        ...props,
    });

export const useEditHabitDialog = () => useDialog(EditHabitDialog);
