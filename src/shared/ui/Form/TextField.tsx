import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const TextField = ({
    value,
    registerProps,
    title,
    placeholder,
    size = 'md',
    rightElement,
    error,
}: {
    value?: string;
    registerProps: UseFormRegisterReturn<any>;
    title: string;
    placeholder?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    rightElement?: React.ReactNode;
    error?: any;
}) => {
    const { t } = useTranslation();
    return (
        <FormControl isInvalid={error}>
            <FormLabel>{title}</FormLabel>

            <InputGroup>
                <Input
                    focusBorderColor='purple.500'
                    type={'text'}
                    value={value}
                    placeholder={placeholder}
                    size={size}
                    borderRadius={size === 'lg' ? 'xl' : 'md'}
                    {...registerProps}
                />
                {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
            </InputGroup>

            <FormErrorMessage>{error && t(error.message)}</FormErrorMessage>
        </FormControl>
    );
};
