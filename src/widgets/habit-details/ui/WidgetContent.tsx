import { Flex, Icon, Text, Tooltip } from '@chakra-ui/react';
import { Icons$ } from '@shared/lib';
import dayjs from 'dayjs';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';

export const WidgetContent = memo(
    ({
        icon,
        title,
        value,
        footerValue,
        type,
        startDate,
        unit = 'days',
    }: {
        title: string;
        value: number;
        icon?: IconType;
        type: 'increase' | 'decrease' | 'streak' | 'none';
        footerValue?: number;
        startDate?: Date;
        unit?: 'times' | 'days' | 'mins';
    }) => {
        const { t } = useTranslation();

        const color = useMemo(() => {
            if ((type === 'increase' || type === 'streak') && footerValue) {
                return 'green.500';
            }
            if (type === 'decrease' && footerValue) {
                return 'red.500';
            }

            return 'gray.500';
        }, [type, footerValue]);

        const footerIcon = useMemo(() => {
            if (type === 'increase' && footerValue) {
                return Icons$.ArrowTop;
            }
            if (type === 'decrease' && footerValue) {
                return Icons$.ArrowBottom;
            }
            return undefined;
        }, [type, footerValue]);

        return (
            <Flex justify='space-between' w='100%'>
                <Flex align='center'>
                    {type === 'streak' && (
                        <Icon color='red.500' as={Icons$.Streak} h='8' w='8' mr='2' />
                    )}
                    <Flex direction='column' justify='center' h='100%'>
                        <Flex align='center'>
                            {type !== 'streak' && icon && <Icon as={icon as any} mr='1' />}
                            <Text fontWeight='normal' letterSpacing='wide' fontSize='md'>
                                {title}
                            </Text>
                        </Flex>
                        <Text fontSize='md' fontWeight='bold' pl={icon ? '1' : '0'} pb={'1'}>
                            {t(`common:${unit}`, { count: value || 0 })}
                        </Text>

                        <Tooltip label={t('habits:currentWeek')}>
                            <Flex align='center' color={color} mb='2' cursor={'pointer'}>
                                {footerIcon && <Icon as={footerIcon} />}
                                <Text
                                    color='inherit'
                                    fontSize='12px'
                                    ml={footerIcon ? 0 : 2}
                                    fontWeight='semibold'
                                >
                                    {footerValue
                                        ? t(`common:${unit}`, { count: footerValue || 0 })
                                        : '---'}
                                </Text>
                            </Flex>
                        </Tooltip>
                    </Flex>
                </Flex>

                {type === 'streak' && startDate && (
                    <Flex align='center'>
                        <Text
                            textTransform='uppercase'
                            fontSize='12px'
                            fontWeight='semibold'
                            color='gray.500'
                            bg='gray.100'
                            borderRadius='8'
                            p='2'
                        >
                            {t('common:date.from', {
                                date: dayjs(startDate).format('MMM DD, YYYY'),
                            })}
                        </Text>
                    </Flex>
                )}
            </Flex>
        );
    },
);

WidgetContent.displayName = 'Statistics';
