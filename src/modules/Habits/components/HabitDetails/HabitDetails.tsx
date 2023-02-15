import {
    Box,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Heading,
    useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import useMobile from '~/common/hooks/useMobile';
import { setTitle } from '~/common/hooks/useTitle';
import { habitsState } from '~/common/store/atoms';
import getCorrectDate from '~/common/utils/getCorrectDate';
import { Widget, WidgetsList } from '~/modules/Habits/components/Grid';
import { WidgetsToolbar } from '~/modules/Habits/components/Grid/WidgetsToolbar';
import { TargetActionContext } from '~/modules/Habits/components/TargetCalendar';
import { WidgetIdentifiers, useWidgets } from '~/modules/Habits/helpers';
import { CreateTargetData, Habit, TargetType } from '~/modules/Habits/types';
import Back from '~/ui/Layout/components/Back';
import { Loader } from '~/ui/Layout/components/Loader';

const GridLayout = WidthProvider(Responsive);

export const HabitDetails = () => {
    const habits = useRecoilValue(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const habit = habits.find((h) => h.id === selectedHabitId);

    if (!habit) {
        return null;
    }

    return <HabitDetailsInner habit={habit} />;
};

export const HabitDetailsInner = ({ habit }: { habit: Habit }) => {
    const setHabits = useSetRecoilState(habitsState);
    const [isEditMode, setIsEditMode] = useState(false);
    const { save, reset, removeWidget, addWidget, widgets, layout, props } = useWidgets(
        habit,
        isEditMode,
    );
    const { t } = useTranslation();

    // TODO: вынести мутейшены в отдельный файл
    const createTarget = useMutation({
        mutationFn: (data: CreateTargetData) => {
            return api
                .post('targets/', { json: data })
                .json<Habit>()
                .then((newHabit) =>
                    setHabits((prev) => prev.map((h) => (h.id !== newHabit.id ? h : newHabit))),
                );
        },
    });

    setTitle(
        t('habits:selectedHabit', {
            title: habit?.title,
        }),
    );

    const handleSaveLayout = () => {
        save();
        setIsEditMode(false);
    };

    const onChangeTarget = useCallback(
        (id: string | undefined, date: Date, targetType: TargetType, value?: number) => {
            createTarget.mutate({
                id: id,
                habitId: habit.id,
                date: getCorrectDate(date),
                targetType: targetType,
                value: value || habit.goal,
            });
        },
        [createTarget, habit.goal, habit.id],
    );

    const {
        isOpen: isOpenWidgetsDrawer,
        onOpen: onOpenWidgetsDrawer,
        onClose: onCloseWidgetsDrawer,
    } = useDisclosure();
    const isMobile = useMobile();

    return (
        <Loader>
            <Flex width={'100%'}>
                <Box m={0} width='100%' maxWidth={'1600px'}>
                    <Flex alignItems={'center'} justifyContent={'space-between'} px={4} pt={2}>
                        <Flex alignItems={'center'}>
                            {isMobile && (
                                <Link to={'/habits'}>
                                    <Back
                                        size={{
                                            base: 'lg',
                                            sm: 'md',
                                        }}
                                    />
                                </Link>
                            )}
                            <Heading as='h3' size='md'>
                                {habit.title}
                            </Heading>
                        </Flex>
                        <WidgetsToolbar
                            handleSaveLayout={handleSaveLayout}
                            resetLayout={reset}
                            isEditMode={isEditMode}
                            onOpenWidgetsDrawer={onOpenWidgetsDrawer}
                            setIsEditMode={setIsEditMode}
                            widgets={widgets}
                        />
                    </Flex>
                    <Box userSelect={isEditMode ? 'none' : 'auto'}>
                        <TargetActionContext.Provider
                            value={{
                                habit,
                                onChangeTarget,
                                targets: habit.targets,
                            }}
                        >
                            <GridLayout {...props}>
                                {layout.map((widget) => (
                                    <Box
                                        key={widget.i}
                                        onDragStart={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={removeWidget}
                                            id={widget.i as WidgetIdentifiers}
                                            statistics={habit.statistics}
                                        />
                                    </Box>
                                ))}
                            </GridLayout>
                        </TargetActionContext.Provider>
                    </Box>
                </Box>
                <Drawer
                    isOpen={isOpenWidgetsDrawer}
                    placement='right'
                    onClose={onCloseWidgetsDrawer}
                >
                    <DrawerOverlay />
                    <DrawerContent
                        width={{
                            sm: '20em',
                            md: '20em',
                            lg: '12em',
                            xl: '14em',
                            '2xl': '15.5em',
                        }}
                    >
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Heading as='h3' size='md'>
                                {t('habits:widgets')}
                            </Heading>
                        </DrawerHeader>
                        <Box p={4}>
                            <WidgetsList
                                widgets={widgets}
                                addWidget={addWidget}
                                onClose={onCloseWidgetsDrawer}
                            />
                        </Box>
                    </DrawerContent>
                </Drawer>
            </Flex>
        </Loader>
    );
};
