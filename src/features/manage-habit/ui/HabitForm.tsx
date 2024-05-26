import {
    Box,
    Button,
    Flex,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Tooltip,
} from '@chakra-ui/react';
import { FrequencyType, HabitData } from '@entities/habit';
import { colors } from '@shared/const';
import { Dialog } from '@shared/hooks';
import { Icons$ } from '@shared/lib';
import { ErrorWrapper, PopoverPicklist, validationRules } from '@shared/ui/Form';
import { TextField } from '@shared/ui/Form/TextField';
import { ImagePlus, PaintBucket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { theme } from '../../../app/providers/ThemeProvider';
import { frequencyAmountInitialState } from '../const/const';
import {
    AmountField,
    DailyFrequencyAmountField,
    FrequencyAmountField,
    FrequencyTypeField,
    GoalField,
    IntervalFrequencyAmountField,
} from './Fields';

export const HabitForm = ({
    dialog,
    initialState,
    actionButtonLabel,
    headerTitleLabel,
    onSubmit,
}: {
    actionButtonLabel: string;
    headerTitleLabel: string;
    initialState: HabitData;
    dialog: Dialog;
    onSubmit: (data: HabitData) => void;
}) => {
    const { t } = useTranslation();

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        setValue,
        watch,
        control,
        trigger,
    } = useForm({
        mode: 'all',
        defaultValues: initialState,
    });

    const onFormSubmit = (data: HabitData) => {
        console.log(data);
        return;
        onSubmit(data);
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        setForm(initialState);
        setValue('name', initialState.name);
        setValue('color', initialState.color);
        setValue('icon', initialState.icon);
        setValue('amount', initialState.amount);
        setValue('goal', initialState.goal);
        setValue('frequencyType', initialState.frequencyType);
        setValue('frequencyAmount', initialState.frequencyAmount);
    }, [initialState, setValue]);

    const dialogRef = useRef<any>(null);

    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>{headerTitleLabel}</ModalHeader>

                <ModalCloseButton />

                <ModalBody as={Stack} spacing={3} ref={dialogRef}>
                    <TextField
                        value={form.name}
                        registerProps={register(
                            'name',
                            validationRules.text({
                                minLength: 3,
                                requiredMessage: 'habits:nameRequired',
                            }),
                        )}
                        title={t('common:name')}
                        size={'lg'}
                        error={errors['name']}
                        rightElement={
                            <Flex
                                gap={2}
                                h={'48px'}
                                my={'auto'}
                                align={'center'}
                                justify={'center'}
                                mr={12}
                            >
                                <PopoverPicklist
                                    dialogRef={dialogRef}
                                    items={colors}
                                    button={
                                        <PopoverPicklist.Button
                                            value={form.color}
                                            tooltipText={t('common:selectColorMessage') as string}
                                            light
                                        >
                                            <Icon as={PaintBucket} strokeWidth={2} />
                                        </PopoverPicklist.Button>
                                    }
                                    item={(color) => (
                                        <PopoverPicklist.Item
                                            value={color}
                                            selectedValue={form.color}
                                            tooltipText={t(`common:colors.${color}`) as string}
                                            onClick={() => setValue('color', color)}
                                        >
                                            <Box
                                                w={'12px'}
                                                h={'12px'}
                                                bg={`${color}.400`}
                                                borderRadius='full'
                                            ></Box>
                                        </PopoverPicklist.Item>
                                    )}
                                />
                                <Controller
                                    name='icon'
                                    control={control}
                                    rules={{
                                        required: t('habits:iconRequired') as string,
                                    }}
                                    render={() => (
                                        <PopoverPicklist
                                            dialogRef={dialogRef}
                                            items={Object.keys(Icons$.habitIcons)}
                                            error={!errors.name && errors.icon}
                                            button={
                                                <PopoverPicklist.Button
                                                    value={form.icon}
                                                    color={form.color}
                                                    tooltipText={
                                                        t('common:selectIconMessage') as string
                                                    }
                                                >
                                                    <Icon
                                                        as={
                                                            form.icon
                                                                ? Icons$.habitIcons[
                                                                      form.icon as keyof typeof Icons$.habitIcons
                                                                  ]
                                                                : ImagePlus
                                                        }
                                                        strokeWidth={2}
                                                    />
                                                </PopoverPicklist.Button>
                                            }
                                            item={(icon) => (
                                                <PopoverPicklist.Item
                                                    value={icon}
                                                    color={form.color}
                                                    selectedValue={form.icon}
                                                    onClick={() => {
                                                        setValue('icon', icon);
                                                        trigger('icon');
                                                    }}
                                                >
                                                    <Icon
                                                        as={
                                                            Icons$.habitIcons[
                                                                icon as keyof typeof Icons$.habitIcons
                                                            ]
                                                        }
                                                        fontSize='lg'
                                                        strokeWidth={2}
                                                        color={
                                                            form.icon === icon
                                                                ? 'white'
                                                                : theme.colors.gray[700]
                                                        }
                                                    />
                                                </PopoverPicklist.Item>
                                            )}
                                        />
                                    )}
                                />
                            </Flex>
                        }
                    />

                    <Flex justifyContent={'space-between'} gap={3}>
                        <GoalField value={form.goal} setValue={setValue} />
                        <AmountField value={form.amount} setValue={setValue} />
                    </Flex>

                    <FrequencyTypeField value={form.frequencyType} setValue={setValue} />

                    {form.frequencyType === FrequencyType.Daily && (
                        <DailyFrequencyAmountField
                            value={form.frequencyAmount}
                            setValue={setValue}
                            initialState={frequencyAmountInitialState[FrequencyType.Daily]}
                        />
                    )}

                    {form.frequencyType === FrequencyType.Weekly && (
                        <FrequencyAmountField
                            value={form.frequencyAmount}
                            setValue={setValue}
                            frequencyTypeAmountPrefix='weeklyFrequencyType'
                        />
                    )}

                    {form.frequencyType === FrequencyType.Monthly && (
                        <FrequencyAmountField
                            value={form.frequencyAmount}
                            setValue={setValue}
                            frequencyTypeAmountPrefix='monthlyFrequencyType'
                        />
                    )}

                    {form.frequencyType === FrequencyType.Interval && (
                        <IntervalFrequencyAmountField
                            value={form.frequencyAmount}
                            setValue={setValue}
                        />
                    )}
                </ModalBody>

                <ModalFooter as={Flex} justify={'end'} columnGap={3}>
                    <Button colorScheme='blue' size={'md'} onClick={dialog.hide}>
                        {t('common:close')}
                    </Button>
                    <Button colorScheme='green' type='submit' size={'md'} isLoading={isSubmitting}>
                        {actionButtonLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
