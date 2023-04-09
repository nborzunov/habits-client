import {
    Box,
    CloseButton,
    Flex,
    GridItem,
    Heading,
    Icon,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { AchievementProgressDialog } from '~/modules/Achievements/components/AchievementProgressDialog';
import { Achievement } from '~/modules/Achievements/types';
import { ProgressBar } from '~/modules/Habits/components/HabitsList/ProgressBar';

export const AchievementCard = ({
    achievement,
    alertView,
}: {
    achievement: Achievement;
    alertView: boolean;
}) => {
    const { t } = useTranslation();
    const toast = useToast();

    const biggestProgress = achievement.progress?.[0];

    const {
        isOpen: isOpenProgressDialog,
        onOpen: onOpenProgressDialog,
        onClose: onCloseProgressDialog,
    } = useDisclosure();
    return (
        <Box
            as={GridItem}
            h={alertView ? '120px' : '160px'}
            w={alertView ? '450px' : '100%'}
            bg={achievement.completed ? 'yellow.100' : 'white'}
            borderRadius={'2xl'}
            p={4}
            position={'relative'}
            boxShadow={'md'}
        >
            {alertView && (
                <CloseButton
                    position={'absolute'}
                    right={2}
                    top={2}
                    onClick={() => toast.closeAll()}
                />
            )}
            <Flex h={'100%'}>
                <Flex
                    w={alertView ? '60px' : '80px'}
                    minWidth={alertView ? '60px' : '80px'}
                    h={alertView ? '80px' : '100px'}
                    borderRadius={'xl'}
                    bg={achievement.completed ? 'yellow.300' : achievement.color}
                    alignItems={'center'}
                    justify={'center'}
                    my={'auto'}
                >
                    <Icon
                        as={Icons.achievements[achievement.key]}
                        fontSize={'4xl'}
                        color={achievement.completed ? 'yellow.600' : 'gray.900'}
                    />
                </Flex>

                <Box p={4} w={'100%'}>
                    <Flex justify={'space-between'}>
                        <Heading size={'md'}>
                            {t(`achievements:list.${achievement.key}.title`)}
                        </Heading>{' '}
                        {achievement.goal && !achievement.completed && biggestProgress && (
                            <Text fontSize={'md'} color={'gray.500'} letterSpacing={'2px'}>
                                {biggestProgress?.progress}/{achievement.goal}
                            </Text>
                        )}
                    </Flex>
                    <Text my={1} h={'12'}>
                        {t(`achievements:list.${achievement.key}.description`)}
                    </Text>

                    {achievement.goal && !achievement.completed && biggestProgress && (
                        <>
                            <Tooltip label={t('achievements:showProgress')}>
                                <Box
                                    cursor={'pointer'}
                                    transition={'all 0.2s ease-in-out'}
                                    _hover={{
                                        opacity: 0.8,
                                    }}
                                    onClick={onOpenProgressDialog}
                                >
                                    <ProgressBar
                                        count={(biggestProgress.progress / achievement.goal) * 100}
                                        mt={2}
                                    />
                                </Box>
                            </Tooltip>

                            <AchievementProgressDialog
                                onClose={onCloseProgressDialog}
                                isOpen={isOpenProgressDialog}
                                achievement={achievement}
                            />
                        </>
                    )}
                    {!alertView && achievement.completed && (
                        <Text fontWeight='semibold' fontSize='md' my={2}>
                            {t('achievements:completedFrom', {
                                date: dayjs(achievement.completedDate).from(dayjs()),
                            })}
                        </Text>
                    )}
                </Box>
            </Flex>
        </Box>
    );
};

AchievementCard.defaultProps = {
    alertView: false,
};
