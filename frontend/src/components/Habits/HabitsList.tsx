import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Flex,
    Heading,
    Icon,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import Icons from '~/services/Icons';
import { GoalType, Habit, HabitData } from '~/types/types';
import Header from '~/components/Habits/Header';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    activeUserState,
    completedHabitsState,
    habitsState,
    selectedHabitIdState,
} from '~/store/atoms';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import EditHabitDialog from '~/components/Habits/EditHabitDialog';
import api from '~/services/api';

const HabitsList = () => {
    const activeUser = useRecoilValue(activeUserState);
    const [habits, setHabits] = useRecoilState(habitsState);
    const completedHabits = useRecoilValue(completedHabitsState);

    const { isLoading } = useQuery<Habit[]>({
        queryKey: ['habits'],
        queryFn: () =>
            api
                .get<Habit[]>('/habits/')
                .then((res) => res.data)
                .then((data) => {
                    setHabits(data);
                    return data;
                }),
        initialData: [],
        enabled: !!activeUser,
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <Box borderRightColor='gray.200' borderRightWidth='2px' h='100vh'>
            <Header />
            <Box>
                <Stack spacing={0}>
                    {habits.map((habit) => (
                        <HabitItem key={habit.id} habit={habit} />
                    ))}
                </Stack>
                {completedHabits.length > 0 && (
                    <Box mt={4}>
                        <Heading as='h3' size='md' mb={4}>
                            Completed habits
                        </Heading>
                        <List styleType='none'>
                            {completedHabits.map((habit) => (
                                <ListItem key={habit.id} mb={2}>
                                    <Text fontSize='lg'>{habit.title}</Text>
                                    {/*    TODO: implement current goal state */}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const HabitItem = ({ habit }: { habit: Habit }) => {
    const [selectedHabitId, setSelectedHabitId] = useRecoilState(selectedHabitIdState);

    const selected = selectedHabitId && habit.id === selectedHabitId;

    const setHabits = useSetRecoilState(habitsState);

    const editHabit = useMutation({
        mutationFn: (formData: HabitData) => {
            return api
                .put<Habit>(`/habits/${habit.id}`, formData)
                .then((res) => res.data)
                .then((newHabit) => {
                    setHabits((prev) => prev.map((h) => (h.id === habit.id ? newHabit : h)));
                })
                .finally(() => onCloseEditHabit());
        },
    });

    const deleteHabit = useMutation({
        mutationFn: () => {
            return api
                .delete<Habit>(`/habits/${habit.id}`)
                .then((res) => res.data)
                .then(() => {
                    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
                    if (selectedHabitId === habit.id) {
                        setSelectedHabitId(null);
                    }
                })
                .finally(() => onCloseDeleteConfirm());
        },
    });

    const archiveHabit = useMutation({
        mutationFn: () => {
            return api
                .put<Habit>(`/habits/${habit.id}/archive`)
                .then((res) => res.data)
                .then(() => {
                    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
                    if (selectedHabitId === habit.id) {
                        setSelectedHabitId(null);
                    }
                })
                .finally(() => onCloseDeleteConfirm());
        },
    });

    const handleEdit = (h: HabitData) => {
        editHabit.mutate(h);
    };

    const handleDelete = () => {
        deleteHabit.mutate();
    };
    const handleArchive = () => {
        archiveHabit.mutate();
    };

    const {
        isOpen: isOpenDeleteConfirm,
        onOpen: onOpenDeleteConfirm,
        onClose: onCloseDeleteConfirm,
    } = useDisclosure();
    const cancelRef = useRef();

    const {
        isOpen: isOpenEditHabit,
        onOpen: onOpenEditHabit,
        onClose: onCloseEditHabit,
    } = useDisclosure();

    return (
        <>
            <Box
                key={habit.id}
                onClick={() => setSelectedHabitId(habit.id)}
                bg={selected ? 'blackAlpha.50' : 'transparent'}
                transition='all 0.2s ease'
                _hover={{
                    bg: selected ? 'blackAlpha.200' : 'blackAlpha.50',
                    cursor: 'pointer',
                }}
                p={2}
                px={4}
                h='64px'
                display='flex'
                justifyContent='space-between'
                alignItems='center'
            >
                <Flex flexDir='column' justifyContent='center'>
                    <Text fontSize='lg'>{habit.title}</Text>

                    <Text fontSize='sm' color='gray.600'>
                        {habit.goal} {habit.goalType === GoalType.Times ? 'times' : 'minutes'}
                    </Text>
                </Flex>

                <Menu>
                    <MenuButton
                        as={IconButton}
                        aria-label='Options'
                        icon={<Icon as={Icons.Menu} />}
                        variant='ghost'
                        size='sm'
                        onClick={(e) => e.stopPropagation()}
                    />
                    <MenuList p={0}>
                        <MenuItem
                            onClick={onOpenEditHabit}
                            pl='4'
                            rounded='md'
                            py='3'
                            cursor='pointer'
                            color='gray.600'
                            _hover={{
                                bg: 'purple.300',
                                color: 'whiteAlpha.900',
                            }}
                            role='group'
                            fontWeight='semibold'
                            transition='.15s ease'
                            onMouseOver={(e) => e.stopPropagation()}
                        >
                            <Flex alignItems={'center'} align='center'>
                                <Icon as={Icons.Edit} mr={2} />
                                <Text>Edit</Text>
                            </Flex>
                        </MenuItem>
                        <MenuItem
                            onClick={onOpenDeleteConfirm}
                            pl='4'
                            rounded='md'
                            py='3'
                            cursor='pointer'
                            color='gray.600'
                            _hover={{
                                bg: 'purple.300',
                                color: 'whiteAlpha.900',
                            }}
                            role='group'
                            fontWeight='semibold'
                            transition='.15s ease'
                        >
                            <Flex alignItems={'center'}>
                                <Icon as={Icons.Delete} mr={2} />
                                <Text>Delete</Text>
                            </Flex>
                        </MenuItem>
                        <MenuItem
                            onClick={handleArchive}
                            pl='4'
                            rounded='md'
                            py='3'
                            cursor='pointer'
                            color='gray.600'
                            _hover={{
                                bg: 'purple.300',
                                color: 'whiteAlpha.900',
                            }}
                            role='group'
                            fontWeight='semibold'
                            transition='.15s ease'
                        >
                            <Flex alignItems={'center'}>
                                <Icon as={Icons.Archive} mr={2} />
                                <Text>Archive</Text>
                            </Flex>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            <AlertDialog
                isOpen={isOpenDeleteConfirm}
                onClose={onCloseDeleteConfirm}
                leastDestructiveRef={cancelRef as any}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Habit "{habit.title}"
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? If you delete this habit, you will lose all your progress.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onCloseDeleteConfirm}>Cancel</Button>
                            <Button colorScheme='blue' onClick={handleArchive} ml={3}>
                                Archive
                            </Button>
                            <Button colorScheme='red' onClick={handleDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <EditHabitDialog
                isOpen={isOpenEditHabit}
                onClose={onCloseEditHabit}
                onSubmit={handleEdit}
                initialState={habit}
            />
        </>
    );
};
export default HabitsList;
