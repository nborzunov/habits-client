import {
    Box,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Achievement } from '~/modules/Achievements/types';
import { ProgressBar } from '~/modules/Habits/components/HabitsList/ProgressBar';

export const AchievementProgressDialog = ({
    isOpen,
    onClose,
    achievement,
}: {
    isOpen: boolean;
    onClose: () => void;
    achievement: Achievement;
}) => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const [selectedHabit, setSelectedHabit] = React.useState<string | null>(null);
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onCloseComplete={() => {
                if (selectedHabit) {
                    navigate(`/habits/${selectedHabit}`);
                }
            }}
        >
            <ModalOverlay />
            <ModalContent mx={4}>
                <ModalHeader>
                    <Heading size={'md'}>
                        {t(`achievements:list.${achievement.key}.title`)}{' '}
                        {t('achievements:progress')}
                    </Heading>
                    <Text my={1} fontWeight={'normal'} fontSize={'md'}>
                        {t(`achievements:list.${achievement.key}.description`)}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={6}>
                    {achievement.progress.map((p) => (
                        <Box
                            key={p.habitId}
                            width={'100%'}
                            bg={'transparent'}
                            transition='all 0.2s ease'
                            _hover={{
                                bg: 'blackAlpha.50',
                                cursor: 'pointer',
                            }}
                            py={2}
                            px={4}
                            onClick={() => {
                                setSelectedHabit(p.habitId);
                                onClose();
                            }}
                        >
                            <Flex justify={'space-between'}>
                                <Heading size={'sm'} fontWeight={'semibold'}>
                                    {p.habitTitle}
                                </Heading>
                                {achievement.goal && !achievement.completed && (
                                    <Text fontSize={'md'} color={'gray.500'} letterSpacing={'2px'}>
                                        {p?.progress}/{achievement.goal}
                                    </Text>
                                )}
                            </Flex>

                            {achievement.completed && (
                                <Text fontWeight='semibold' fontSize='md' my={2}>
                                    {t('achievements:completedFrom', {
                                        date: dayjs(achievement.completedDate).from(dayjs()),
                                    })}
                                </Text>
                            )}

                            <ProgressBar count={(p.progress / (achievement.goal ?? 1)) * 100} />
                        </Box>
                    ))}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
