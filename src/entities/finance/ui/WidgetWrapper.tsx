import { Box, Button, Divider, Flex, Stack, Text } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export const WidgetWrapper = ({
    title,
    data,
    link,
    linkText,
    children,
}: PropsWithChildren<{ title: string; data: any[]; link: string; linkText: string }>) => (
    <Box
        borderRadius='xl'
        p='2'
        display='flex'
        flexDirection='column'
        height={'100%'}
        position={'relative'}
        w={'450px'}
        px={4}
        py={6}
        bg={'white'}
        boxShadow={'sm'}
    >
        <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text fontWeight='bold' letterSpacing='wide' fontSize='lg' color='gray.700' pb={2}>
                {title}
            </Text>
        </Flex>

        <Divider h={'2px'} />
        <Flex pt={4} px={2} h='261px' flexDir='column' justifyContent={'space-between'}>
            <Stack spacing={3}>{children}</Stack>

            {data.length > 3 && (
                <Link to={link}>
                    <Button mt={4} width={'100%'} variant='outline' colorScheme={'cyan'}>
                        {linkText} ({data.length})
                    </Button>
                </Link>
            )}
        </Flex>
    </Box>
);