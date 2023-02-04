import { Button, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import useTitle from '~/common/hooks/useTitle';

export const Auth = () => {
    const { t } = useTranslation();

    useTitle(t('common:home'));
    return (
        <>
            <Stack align={'center'} pb={8}>
                <Heading
                    fontSize={{
                        base: '3xl',
                        sm: '2xl',
                    }}
                    textAlign={'center'}
                >
                    {t('profile:welcome')}
                </Heading>
                <Text fontSize={'lg'} color={'gray.600'} textAlign={'center'}>
                    {t('profile:welcomeDescription')}
                </Text>
            </Stack>
            <Grid templateColumns={'repeat(2, 1fr)'} gap={4} mt={2}>
                <GridItem>
                    <NavLink to='login'>
                        <Button
                            loadingText={t('common:formSubmitting') as string}
                            size={{
                                base: 'lg',
                                sm: 'md',
                            }}
                            colorScheme={'purple'}
                            variant={'outline'}
                            width={'100%'}
                        >
                            {t('common:signin.lower')}
                        </Button>
                    </NavLink>
                </GridItem>
                <GridItem>
                    <NavLink to='signup'>
                        <Button
                            loadingText={t('common:formSubmitting') as string}
                            size={{
                                base: 'lg',
                                sm: 'md',
                            }}
                            colorScheme={'purple'}
                            width={'100%'}
                        >
                            {t('common:signup.lower')}
                        </Button>
                    </NavLink>
                </GridItem>
            </Grid>
        </>
    );
};
