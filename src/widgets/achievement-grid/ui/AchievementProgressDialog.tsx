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
import { useModal } from '@ebay/nice-modal-react';
import { Achievement } from '@entities/achievement';
import { createDialog, openDialog } from '@shared/hooks';
import { ProgressBar } from '@shared/ui/ProgressBar';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type Props = {
    achievement: Achievement;
};
export const AchievementProgressDialog = createDialog(({ achievement }: Props) => {
    const { t } = useTranslation();

    const dialog = useModal();
    const navigate = useNavigate();

    const [selectedHabit, setSelectedHabit] = React.useState<string | null>(null);

    return (
        <Modal
            isOpen={dialog.visible}
            onClose={dialog.hide}
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
                            key={p.habit_id}
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
                                setSelectedHabit(p.habit_id);
                                dialog.hide();
                            }}
                        >
                            <Flex justify={'space-between'}>
                                <Heading size={'sm'} fontWeight={'semibold'}>
                                    {p.habit_title}
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
                                        date: dayjs(achievement.completed_date).from(dayjs()),
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
});

export const openAchievementProgressDialog = (props: Props) =>
    openDialog(AchievementProgressDialog, {
        id: 'AchievementProgress',
        ...props,
    });

// export const useAchivementProgressDialog = () => useDialog(AchievementProgressDialog);
