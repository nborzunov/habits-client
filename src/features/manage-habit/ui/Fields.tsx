import {
    Button,
    Center,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Tooltip,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import { FrequencyType } from '@entities/habit';
import { Icons$ } from '@shared/lib';
import { LucideIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { frequencyAmountInitialState } from '../const/const';

const SelectButton = ({
    text,
    onClick,
    selected,
}: {
    text: string;
    onClick: () => void;
    selected: boolean;
}) => {
    return (
        <Button
            onClick={() => onClick()}
            borderRadius='full'
            borderWidth='2px'
            borderColor={selected ? 'purple.500' : 'transparent'}
            colorScheme={selected ? 'purple' : 'gray'}
            variant={selected ? 'solid' : 'filled'}
            bg={selected ? 'purple.500' : 'gray.100'}
            color={selected ? 'white' : 'gray.500'}
            _hover={{
                bg: selected ? 'purple.600' : 'gray.200',
                cursor: 'pointer',
            }}
        >
            {text}
        </Button>
    );
};

export const FrequencyTypeField = ({
    value,
    setValue,
}: {
    value: string;
    setValue: UseFormSetValue<any>;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl>
            <FormLabel>{t('habits:frequencyType')}</FormLabel>

            <Flex direction='column'>
                <Flex justify='space-between'>
                    {Object.values(FrequencyType).map((frequencyType) => (
                        <SelectButton
                            key={frequencyType}
                            text={t(`habits:frequencyTypeOptions.${frequencyType}`)}
                            selected={value === frequencyType}
                            onClick={() => {
                                setValue('frequency_type', frequencyType);
                                setValue(
                                    'frequency_amount',
                                    frequencyAmountInitialState[frequencyType],
                                );
                            }}
                        />
                    ))}
                </Flex>
            </Flex>
        </FormControl>
    );
};

export const DailyFrequencyAmountField = ({
    value,
    setValue,
    initialState,
}: {
    value: number[];
    setValue: UseFormSetValue<any>;
    initialState: number[];
}) => {
    const { t } = useTranslation();
    const [repeatEveryday, setRepeatEveryday] = useState(true);

    function handleDayChange(day: number) {
        if (value.includes(day)) {
            setValue(
                'frequency_amount',
                value.filter((option) => option !== day),
            );
            setRepeatEveryday(false);
        } else {
            const newOptions = [...value, day];
            setValue('frequency_amount', newOptions);
            if (newOptions.length === 7) {
                setRepeatEveryday(true);
            }
        }
    }
    return (
        <FormControl>
            <Flex direction='column' gap='3' mt='3'>
                <Flex justify={'space-between'}>
                    <FormLabel>{t('habits:repeatEveryday')}</FormLabel>

                    <Checkbox
                        colorScheme={'purple'}
                        isChecked={repeatEveryday}
                        onChange={(e) => {
                            setRepeatEveryday(e.target.checked);
                            if (e.target.checked) {
                                setValue('frequency_amount', initialState);
                            }
                        }}
                    />
                </Flex>
                <Flex justify='space-between'>
                    {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <Tooltip key={day} label={t(`common:weekDaysLong.${day}`)}>
                            <SelectButton
                                text={t(`common:weekDaysShort.${day}`)}
                                selected={value.includes(day)}
                                onClick={() => handleDayChange(day)}
                            />
                        </Tooltip>
                    ))}
                </Flex>
            </Flex>
        </FormControl>
    );
};

export const FrequencyAmountField = ({
    value,
    setValue,
    frequencyTypeAmountPrefix,
}: {
    value: number[];
    setValue: UseFormSetValue<any>;
    frequencyTypeAmountPrefix: string;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl>
            <Flex direction='column' gap='3' mt='3'>
                <Flex justify={'space-between'}>
                    <FormLabel>{t(`habits:${frequencyTypeAmountPrefix}.${value[0]}`)}</FormLabel>
                </Flex>
                <Flex justify='space-between'>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <SelectButton
                            key={day}
                            text={day.toString()}
                            selected={value[0] === day}
                            onClick={() => setValue('frequency_amount', [day])}
                        />
                    ))}
                </Flex>
            </Flex>
        </FormControl>
    );
};

export const IntervalFrequencyAmountField = ({
    value,
    setValue,
}: {
    value: number[];
    setValue: UseFormSetValue<any>;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl>
            <Flex direction='column' gap='3' mt='3'>
                <FormLabel>{t('habits:setCustomInterval')}</FormLabel>
                <Flex align='center' gap='4'>
                    <FormLabel m={0}>{t('common:every')}</FormLabel>

                    <NumberInput
                        min={1}
                        max={365}
                        width='80px'
                        value={value[0]}
                        onChange={(val) => setValue('frequency_amount', [Number(val) || 0])}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                    <FormLabel m={0}>{t(`habits:days`, { count: value[0] })}</FormLabel>
                </Flex>
            </Flex>
        </FormControl>
    );
};

const AmountCard = ({
    icon,
    name,
    description,
    color,
}: {
    icon: LucideIcon;
    name: string;
    description: string;
    color: string;
}) => (
    <Button
        variant='ghost'
        colorScheme={color}
        display='flex'
        gap={4}
        py={10}
        px={6}
        borderRadius='2xl'
        width='100%'
    >
        <Center
            w='56px'
            h='56px'
            bgGradient={`linear(to-b, ${color}.400, ${color}.300)`}
            borderRadius='full'
        >
            <Icon as={icon} strokeWidth={2} fontSize='2xl' color={`${color}.50`} />
        </Center>
        <Flex direction='column' justify='space-around' align='start'>
            <Text m={0} fontWeight='semibold' fontSize='lg' color='gray.700'>
                {name}
            </Text>
            <Text p={0} mt={1} fontWeight='semibold' color={`${color}.500`}>
                {description}
            </Text>
        </Flex>
    </Button>
);

const PopoverField = ({
    children,
    triggerContent,
    isOpen,
    placement,
    onOpen,
    onClose,
}: {
    children: ReactNode;
    triggerContent: ReactNode;
    isOpen: boolean;
    placement?: 'bottom-end' | 'bottom-start';
    onOpen: () => void;
    onClose: () => void;
}) => (
    <Popover placement={placement} arrowSize={16} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverTrigger>{triggerContent}</PopoverTrigger>
        <PopoverContent boxShadow='xl' borderRadius='2xl' p={3}>
            <PopoverArrow />
            <PopoverBody p={0}>
                <FormControl>{children}</FormControl>
            </PopoverBody>
        </PopoverContent>
    </Popover>
);

export const AmountField = ({
    value,
    setValue,
}: {
    value: number;
    setValue: UseFormSetValue<any>;
}) => {
    const { t } = useTranslation();

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <PopoverField
            isOpen={isOpen}
            placement='bottom-end'
            onOpen={onOpen}
            onClose={onClose}
            triggerContent={
                <Flex width='50%'>
                    <AmountCard
                        icon={Icons$.Star}
                        name={t('habits:amountTitle')}
                        description={t(`habits:amountCount`, { count: value })}
                        color='orange'
                    />
                </Flex>
            }
        >
            <Flex direction='column' gap='3' mt='3'>
                <FormLabel>{t('habits:amountTitle')}</FormLabel>
                <Flex align='center' gap='4'>
                    <NumberInput
                        min={1}
                        max={365}
                        width='80px'
                        value={value}
                        onChange={(val) => setValue('amount', Number(val) || 0)}
                        onKeyPress={(e) => {
                            e.preventDefault();
                            if (e.key === 'Enter') {
                                onClose();
                            }
                        }}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                    <FormLabel m={0}>{t(`habits:amount`, { count: value })}</FormLabel>
                </Flex>
            </Flex>
        </PopoverField>
    );
};

const CustomGoalButtons = ({
    value,
    setValue,
    showCustomGoal,
    setShowCustomGoal,
    onClose,
}: {
    value: number;
    setValue: UseFormSetValue<any>;
    showCustomGoal: boolean;
    setShowCustomGoal: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
}) => (
    <VStack spacing={4} width='100%'>
        {[21, 60, 90].map((days) => (
            <Button
                key={days}
                colorScheme='green'
                width='100%'
                variant={!showCustomGoal && value === days ? 'solid' : 'outline'}
                onClick={() => {
                    setValue('goal', days);
                    setShowCustomGoal(false);
                }}
            >
                {`${days} Days`}
            </Button>
        ))}
        <Button
            colorScheme='green'
            width='100%'
            variant={showCustomGoal ? 'solid' : 'outline'}
            onClick={() => setShowCustomGoal(true)}
        >
            Custom Interval
        </Button>
        <FormControl isDisabled={!showCustomGoal}>
            <FormLabel htmlFor='custom-days'>Enter Goal (Days):</FormLabel>
            <Input
                id='custom-days'
                type='number'
                min={7}
                value={value || ''}
                onChange={(e) => setValue('goal', Number(e.target.value))}
                onKeyPress={(e) => {
                    e.preventDefault();
                    if (e.key === 'Enter') {
                        onClose();
                    }
                }}
            />
        </FormControl>
    </VStack>
);

export const GoalField = ({
    value,
    setValue,
}: {
    value: number;
    setValue: UseFormSetValue<any>;
}) => {
    const { t } = useTranslation();
    const [showCustomGoal, setShowCustomGoal] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <PopoverField
            isOpen={isOpen}
            placement='bottom-start'
            onOpen={onOpen}
            onClose={onClose}
            triggerContent={
                <Flex width='50%'>
                    <AmountCard
                        icon={Icons$.Trophy}
                        name={t('habits:goalTitle')}
                        description={t(`habits:goalCount`, { count: value })}
                        color='green'
                    />
                </Flex>
            }
        >
            <CustomGoalButtons
                onClose={onClose}
                value={value}
                setValue={setValue}
                showCustomGoal={showCustomGoal}
                setShowCustomGoal={setShowCustomGoal}
            />
        </PopoverField>
    );
};
