import { Box, Button, Flex, Heading, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';
import { WIDGETS, WidgetIdentifiers } from '~/modules/Habits/helpers';

export const WidgetsList = ({
    widgets,
    addWidget,
}: {
    widgets: WidgetIdentifiers[];
    addWidget: (id: WidgetIdentifiers) => void;
}) => {
    const addAll = () => {
        widgets.forEach((widget) => addWidget(widget));
    };

    const isMobile = useMobile();
    const { t } = useTranslation();

    return (
        <>
            {!widgets.length && <Heading fontSize={'xl'}>{t('habits:noWidgets')}</Heading>}
            {widgets.length > 0 && (
                <>
                    <Stack spacing={3} width={'100%'}>
                        {widgets.map((widget) => (
                            <Box
                                key={widget}
                                borderRadius='xl'
                                borderColor='gray.200'
                                borderWidth='2px'
                                p='3'
                            >
                                <Flex justifyContent={'space-between'}>
                                    <Flex alignItems={'center'}>
                                        <Icon
                                            as={WIDGETS[widget].icon}
                                            color='green.500'
                                            mr={'2'}
                                        />
                                        <Box>
                                            <Text fontWeight={'semibold'}>
                                                {t(WIDGETS[widget].title)}
                                            </Text>
                                            <Text color={'gray.500'} fontSize={'sm'}>
                                                {WIDGETS[widget][isMobile ? 'mobile' : 'desktop'].w}
                                                x
                                                {WIDGETS[widget][isMobile ? 'mobile' : 'desktop'].h}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <IconButton
                                        icon={<Icon as={Icons.Add} />}
                                        aria-label={'add widget'}
                                        variant={'ghost'}
                                        onClick={() => addWidget(widget)}
                                    />
                                </Flex>
                            </Box>
                        ))}
                    </Stack>
                    {widgets.length > 0 && (
                        <Button mt={4} colorScheme={'purple'} width={'100%'} onClick={addAll}>
                            {t('habits:addWidgets')}
                        </Button>
                    )}
                </>
            )}
        </>
    );
};
