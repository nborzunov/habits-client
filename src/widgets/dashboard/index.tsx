import { Box, Flex, Heading, Icon, IconButton, Select, Text } from '@chakra-ui/react';
import { Icons$ } from '@shared/lib';

export const Dashboard = () => {
    return (
        <Box>
            <Flex justify='space-between' p='6' py='8'>
                <Flex direction='column'>
                    <Heading fontSize='24px'>Hello, Nikolay👋</Heading>
                    <Text color='gray.500'>Let&apos;s check your stats today!</Text>
                </Flex>

                <Flex gap='2'>
                    <Select
                        placeholder='Select option'
                        variant='outline'
                        bg='white'
                        value='overall'
                    >
                        <option value='overall'>Overall</option>
                        <option value='option2'>Option 2</option>
                        <option value='option3'>Option 3</option>
                    </Select>

                    <IconButton
                        aria-label='Search database'
                        bg='white'
                        icon={<Icon as={Icons$.Notifications} />}
                    />
                </Flex>
            </Flex>
        </Box>
    );
};
