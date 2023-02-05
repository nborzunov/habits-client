import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react';

const NumericInput = ({
    min,
    max,
    value,
    onChange,
}: {
    min?: number;
    max?: number;
    value: number;
    onChange: (value: number) => void;
}) => {
    return (
        <NumberInput
            allowMouseWheel
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(!Number.isNaN(Number(e)) ? Number(e) : 1)}
            size={{
                base: 'md',
                sm: 'md',
            }}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    );
};

export default NumericInput;
