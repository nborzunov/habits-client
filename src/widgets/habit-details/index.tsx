import { Flex, useDisclosure } from '@chakra-ui/react';
import { Habit, habitsState } from '@entities/habit';
import { useWidgets } from '@entities/habit/hooks/useWidgets';
import { setTitle } from '@shared/hooks';
import { Loader } from '@shared/ui/Loader';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { AddWidgetsDrawer } from './ui/AddWidgetDrawer';
import { Header } from './ui/Header';
import { WidgetsGrid } from './ui/WidgetsGrid';
import { WidgetsList } from './ui/WidgetsList';
import { WidgetsToolbar } from './ui/WidgetsToolbar';

export const HabitDetails = () => {
    const habits = useRecoilValue(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const habit = habits.find((h) => h.id === selectedHabitId);
    if (!habit) {
        return null;
    }

    return <HabitDetailsContent habit={habit} />;
};
const HabitDetailsContent = ({ habit }: { habit: Habit }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { t } = useTranslation();

    setTitle(
        t('habits:selectedHabit', {
            title: habit?.title,
        }),
    );

    const { save, reset, addWidget, widgets } = useWidgets(habit, isEditMode);

    const handleSaveLayout = () => {
        save();
        setIsEditMode(false);
    };

    const {
        isOpen: isOpenWidgetsDrawer,
        onOpen: onOpenWidgetsDrawer,
        onClose: onCloseWidgetsDrawer,
    } = useDisclosure();

    return (
        <Loader>
            <Flex m={0} width='100%' maxWidth={'1600px'} flexDir={'column'}>
                <HabitDetails.Header title={habit.title}>
                    <HabitDetails.WidgetsToolbar
                        handleSaveLayout={handleSaveLayout}
                        resetLayout={reset}
                        isEditMode={isEditMode}
                        onOpenWidgetsDrawer={onOpenWidgetsDrawer}
                        setIsEditMode={setIsEditMode}
                        widgets={widgets}
                    />
                    <HabitDetails.AddWidgetsDrawer
                        isOpen={isOpenWidgetsDrawer}
                        onClose={onCloseWidgetsDrawer}
                    >
                        <HabitDetails.WidgetsList
                            widgets={widgets}
                            addWidget={addWidget}
                            habit={habit}
                            onClose={onCloseWidgetsDrawer}
                        />
                    </HabitDetails.AddWidgetsDrawer>
                </HabitDetails.Header>

                <HabitDetails.WidgetsGrid habit={habit} isEditMode={isEditMode} />
            </Flex>
        </Loader>
    );
};

HabitDetails.Header = Header;
HabitDetails.AddWidgetsDrawer = AddWidgetsDrawer;
HabitDetails.WidgetsGrid = WidgetsGrid;
HabitDetails.WidgetsToolbar = WidgetsToolbar;
HabitDetails.WidgetsList = WidgetsList;
