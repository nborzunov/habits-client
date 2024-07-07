import { Avatar, Flex, Menu, MenuButton, MenuList, Text, Tooltip } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { OperationMenuItem } from '@shared/ui/OperationMenuItem';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';

export const ProfileInfoToolbar = ({ isOpenable }: { isOpenable: boolean }) => {
    const user = useRecoilValue(activeUserState);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const minimizeSidebar = false;

    return (
        <Flex zIndex='dropdown' position='relative'>
            <Menu>
                <Tooltip
                    label={user?.username}
                    placement='bottom'
                    isDisabled={!minimizeSidebar}
                    openDelay={500}
                >
                    <MenuButton
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOpenable) {
                                e.preventDefault();
                            }
                        }}
                        width={!minimizeSidebar ? '100%' : '40px'}
                        px={!minimizeSidebar ? '4' : '2'}
                        py={!minimizeSidebar ? '3' : '2'}
                        rounded='md'
                        color='gray.600'
                        role='group'
                        fontWeight='bold'
                        transition='.15s ease'
                        {...(isOpenable
                            ? {
                                  _hover: {
                                      bg: 'purple.300',
                                      color: 'whiteAlpha.900',
                                  },
                                  cursor: 'pointer',
                              }
                            : {
                                  cursor: 'default',
                              })}
                    >
                        <Flex align='center' columnGap={3}>
                            <Avatar
                                color={'black'}
                                size={minimizeSidebar ? 'xs' : 'sm'}
                                colorScheme={'black'}
                                bgColor={'purple.300'}
                                display='block'
                            />

                            {!minimizeSidebar && <Text display='block'>{user?.username}</Text>}
                        </Flex>
                    </MenuButton>
                </Tooltip>
                <MenuList p={0} mx={4}>
                    <OperationMenuItem
                        onClick={() => navigate('/me')}
                        label={t('common:profile')}
                    />
                    <OperationMenuItem
                        onClick={() => navigate('/me/edit')}
                        label={t('common:edit')}
                    />
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
        </Flex>
    );
};
