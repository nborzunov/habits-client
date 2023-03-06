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
import React, { useCallback, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useMobile from '~/common/hooks/useMobile';
import { setTitle } from '~/common/hooks/useTitle';
import { habitsState } from '~/common/store/atoms';
import getCorrectDate from '~/common/utils/getCorrectDate';
import { useCreateTarget } from '~/modules/Habits/api/useCreateTarget';
import { Widget, WidgetsList } from '~/modules/Habits/components/Grid';
import { WidgetsToolbar } from '~/modules/Habits/components/Grid/WidgetsToolbar';
import { TargetActionContext } from '~/modules/Habits/components/TargetCalendar';
import { WidgetIdentifiers, useWidgets } from '~/modules/Habits/helpers';
import { Habit, TargetType } from '~/modules/Habits/types';
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
    const [isEditMode, setIsEditMode] = useState(false);
    const { save, reset, removeWidget, addWidget, widgets, layout, props } = useWidgets(
        habit,
        isEditMode,
    );
    const { t } = useTranslation();
    const { mutate: createTarget } = useCreateTarget();
    const isMobile = useMobile();

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
            createTarget({
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

    return (
        <Loader>
            <Flex m={0} width='100%' maxWidth={'1600px'} flexDir={'column'}>
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
                                    habit={habit}
                                    onClose={onCloseWidgetsDrawer}
                                />
                            </Box>
                        </DrawerContent>
                    </Drawer>
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
                                        habit={habit}
                                    />
                                </Box>
                            ))}
                        </GridLayout>
                    </TargetActionContext.Provider>
                </Box>
            </Flex>
        </Loader>
    );
};
