import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Textarea,
    Tooltip,
} from '@chakra-ui/react';
import { Icons$ } from '@shared/lib/Icons';
import { useState } from 'react';

import { ErrorWrapper } from './ErrorWrapper';
import { FormFieldProps } from './types';

export const FormField = ({
    type,
    field,
    label,
    initialValue,
    value,
    hideResetButton,
    minWidth,
    isRequired,
    validationError,
    validationProps,
    resetValue,
    direction,
    variant,
    showPasswordIcon,
}: FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <ErrorWrapper error={validationError}>
            <FormControl isInvalid={validationError} isRequired={isRequired}>
                <Flex flexDirection={direction} justifyContent={'space-between'}>
                    <FormLabel mr={3} mb={0} lineHeight={'40px'} width='100%' maxWidth={minWidth}>
                        {label}
                        {direction === 'row' && ':'}
                    </FormLabel>
                    <InputGroup>
                        {field !== 'bio' ? (
                            <Input
                                id={field}
                                type={
                                    type
                                        ? type
                                        : !showPasswordIcon || showPassword
                                        ? field === 'email'
                                            ? 'email'
                                            : 'text'
                                        : 'password'
                                }
                                focusBorderColor='purple.500'
                                placeholder={label}
                                variant={variant}
                                {...validationProps}
                            />
                        ) : (
                            <Textarea
                                id={field}
                                focusBorderColor='purple.500'
                                placeholder={label}
                                variant={variant}
                                {...validationProps}
                            />
                        )}
                        {initialValue !== value && !hideResetButton && (
                            <InputRightElement>
                                <Tooltip label={'Reset to previous'}>
                                    <IconButton
                                        icon={<Icon as={Icons$.Reset} />}
                                        aria-label={'reset'}
                                        size='sm'
                                        variant={'unstyled'}
                                        _hover={{ color: 'purple.500' }}
                                        onClick={resetValue}
                                    />
                                </Tooltip>
                            </InputRightElement>
                        )}
                        {showPasswordIcon && (
                            <InputRightElement h={'full'}>
                                <Button
                                    variant={'ghost'}
                                    onClick={() => setShowPassword((showPassword) => !showPassword)}
                                >
                                    {!showPassword ? (
                                        <Icon as={Icons$.Show} />
                                    ) : (
                                        <Icon as={Icons$.Hide} />
                                    )}
                                </Button>
                            </InputRightElement>
                        )}
                    </InputGroup>
                </Flex>
            </FormControl>
        </ErrorWrapper>
    );
};

FormField.defaultProps = {
    hideResetButton: false,
    isRequired: false,
    minWidth: {
        lg: '200px',
        md: '200px',
        sm: '200px',
    },
    direction: 'row',
    variant: 'filled',
    showPasswordIcon: false,
};
