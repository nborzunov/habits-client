import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ProgressBar = ({
    count,
    start,
    end,
    ...props
}: {
    count: number;
    start?: number;
    end?: number;
} & BoxProps) => {
    const { t } = useTranslation();

    return (
        <Box width={'100%'} my={4} {...props}>
            <Box width='100%' h='10px' bg={'purple.100'} borderRadius={'lg'}>
                <Box
                    width={`${count}%`}
                    maxWidth={'100%'}
                    minWidth='6px'
                    h='10px'
                    bg={'purple.500'}
                    borderRadius={'lg'}
                />
            </Box>
            {end && (
                <Flex justify={'space-between'} fontWeight={'semibold'} my={1}>
                    <Text>
                        {t('common:days', {
                            count: start,
                        })}
                    </Text>
                    <Text>
                        {t('common:days', {
                            count: end,
                        })}
                    </Text>
                </Flex>
            )}
        </Box>
    );
};
