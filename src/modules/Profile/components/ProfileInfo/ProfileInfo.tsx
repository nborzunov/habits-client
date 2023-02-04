import { Avatar, Menu, MenuButton, MenuList, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { activeUserState } from '~/common/store/atoms';
import { OperationMenuItem } from '~/modules/Habits/components/HabitsList/HabitItem';

export const ProfileInfo = () => {
    const user = useRecoilValue(activeUserState);
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Menu>
            <MenuButton as={Stack} onClick={(e) => e.stopPropagation()}>
                <Stack
                    direction={'row'}
                    spacing={3}
                    align={'center'}
                    px='4'
                    mx='4'
                    rounded='md'
                    py='3'
                    cursor='pointer'
                    color='gray.600'
                    _hover={{
                        bg: 'purple.300',
                        color: 'whiteAlpha.900',
                    }}
                    role='group'
                    fontWeight='bold'
                    transition='.15s ease'
                >
                    <Avatar
                        color={'black'}
                        size={'sm'}
                        colorScheme={'black'}
                        bgColor={'purple.300'}
                    />

                    <Text>{user?.username}</Text>
                </Stack>
            </MenuButton>
            <MenuList p={0} mx={4} zIndex={'dropdown'}>
                <OperationMenuItem onClick={() => navigate('/me')} label={t('common:profile')} />
                <OperationMenuItem onClick={() => navigate('/me/edit')} label={t('common:edit')} />
                <OperationMenuItem
                    onClick={() => navigate('/me/notifications')}
                    label={t('common:notifications')}
                />
                <OperationMenuItem
                    onClick={() => navigate('/me/change-password')}
                    label={t('common:changePassword')}
                />
                <OperationMenuItem
                    onClick={() => navigate('/me/change-email')}
                    label={t('common:changeEmail')}
                />
                <OperationMenuItem
                    onClick={() => navigate('/me/delete-account')}
                    label={t('common:deleteAccount')}
                />
                <OperationMenuItem
                    onClick={() => navigate('/me/clean-data')}
                    label={t('common:cleanData')}
                />
            </MenuList>
        </Menu>
    );
};
