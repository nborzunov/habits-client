import { Flex, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icons$ } from '@shared/lib';
import { createContext, useContext, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    id: UniqueIdentifier;
}

interface Context {
    attributes: Record<string, any>;
    listeners: DraggableSyntheticListeners;
    ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
    attributes: {},
    listeners: undefined,
    ref() {},
});

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });
    const context = useMemo(
        () => ({
            attributes,
            listeners,
            ref: setActivatorNodeRef,
        }),
        [attributes, listeners, setActivatorNodeRef],
    );
    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <SortableItemContext.Provider value={context}>
            <Flex
                as={'li'}
                ref={setNodeRef}
                style={style}
                listStyleType='none'
                align='center'
                bg={isDragging ? 'blue.50' : 'white'}
            >
                {children}
            </Flex>
        </SortableItemContext.Provider>
    );
}

export function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);
    const { t } = useTranslation();
    return (
        <Tooltip label={t('common:reorder')}>
            <IconButton
                aria-label='drag'
                {...attributes}
                {...listeners}
                ref={ref}
                icon={<Icon as={Icons$.DragHandle} />}
                colorScheme='green'
                size='sm'
                variant={'outline'}
            />
        </Tooltip>
    );
}
