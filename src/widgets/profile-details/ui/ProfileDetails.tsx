import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { useTitle } from '@shared/hooks';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

export const ProfileDetails = () => {
    const user = useRecoilValue(activeUserState);
    useTitle(`${user?.name} ${user?.surname}`);

    const { t } = useTranslation();

    if (!user) return null;
    return (
        <Box mx='auto'>
            <Stack>
                <Flex justifyContent={'space-between'}>
                    <Flex>
                        <Avatar
                            src={user.image}
                            rounded='full'
                            color={'black'}
                            size={'sm'}
                            colorScheme={'black'}
                            bgColor={'purple.300'}
                            width={'4.5em'}
                            height={'4.5em'}
                            mr={'4'}
                        />
                        <Flex flexDirection={'column'} justifyContent={'space-evenly'}>
                            <Text fontWeight='bold' fontSize='lg'>
                                {user.name} {user.surname}
                            </Text>
                            <Text fontSize='md'>{user.username}</Text>
                        </Flex>
                    </Flex>
                    <Stack>
                        <Text fontWeight='semibold' fontSize='md' pl={4}>
                            {t('profile:joined', {
                                date: dayjs(user.createdDate).from(dayjs()),
                            })}
                        </Text>
                    </Stack>
                </Flex>

                <Stack pt={4}>
                    <Text fontWeight={'semibold'} mt={'2'}>
                        {t('profile:bio.short')}
                    </Text>
                    <Text>{user.bio ? user.bio : t('profile:bio.noValue')}</Text>
                </Stack>
                <Stack>
                    <Text fontWeight={'semibold'} mt={'2'}>
                        {t('profile:email.short')}
                    </Text>
                    <Text>{user.email}</Text>
                </Stack>
            </Stack>
        </Box>
    );
};
