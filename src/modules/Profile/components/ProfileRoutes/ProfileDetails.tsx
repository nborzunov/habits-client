import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useRecoilValue } from 'recoil';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';

export const ProfileDetails = () => {
    const user = useRecoilValue(activeUserState);
    useTitle(`${user?.name} ${user?.surname}`);

    if (!user) return null;
    return (
        <Box maxW='700px' mx='auto'>
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
                            width={'70px'}
                            height={'70px'}
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
                        <Text fontWeight='semibold' fontSize='md'>{`Joined ${dayjs(
                            user.createdDate,
                        ).from(dayjs())}`}</Text>
                    </Stack>
                </Flex>

                <Stack pt={4}>
                    <Text fontWeight={'semibold'} mt={'2'}>
                        Bio
                    </Text>
                    <Text>{user.bio ? user.bio : 'No bio provided.'}</Text>
                </Stack>
                <Stack>
                    <Text fontWeight={'semibold'} mt={'2'}>
                        Email
                    </Text>
                    <Text>{user.email}</Text>
                </Stack>
            </Stack>
        </Box>
    );
};
