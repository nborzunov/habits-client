import {
    Avatar,
    Box,
    Menu,
    MenuButton,
    MenuList,
    Text,
    Tooltip,
    useMediaQuery,
} from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { MEDIA_QUERIES } from '@shared/const';
import { OperationMenuItem } from '@shared/ui/OperationMenuItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

export const ProfileInfoToolbar = () => {
    const user = useRecoilValue(activeUserState);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const sizes = useMediaQuery(MEDIA_QUERIES);

    const minimizeSidebar = !sizes[4];

    return (
        <Menu>
            <Tooltip
                label={user?.username}
                placement='bottom'
                isDisabled={!minimizeSidebar}
                openDelay={500}
            >
                <MenuButton
                    as={Box}
                    onClick={(e) => e.stopPropagation()}
                    align={'center'}
                    width={!minimizeSidebar ? '100%' : '40px'}
                    px={!minimizeSidebar ? '4' : '2'}
                    rounded='md'
                    py={!minimizeSidebar ? '3' : '2'}
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
                        size={minimizeSidebar ? 'xs' : 'sm'}
                        colorScheme={'black'}
                        bgColor={'purple.300'}
                    />

                    {!minimizeSidebar && <Text>{user?.username}</Text>}
                </MenuButton>
            </Tooltip>
            <MenuList p={0} mx={4} zIndex={10000}>
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
