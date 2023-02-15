import { Button, HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';

export const WidgetsToolbar = ({
    isEditMode,
    handleSaveLayout,
    onOpenWidgetsDrawer,
    widgets,
    setIsEditMode,
    resetLayout,
}: {
    isEditMode: boolean;
    handleSaveLayout: () => void;
    onOpenWidgetsDrawer: () => void;
    widgets: string[];
    setIsEditMode: (isEditMode: boolean) => void;
    resetLayout: () => void;
}) => {
    const { t } = useTranslation();
    const isMobile = useMobile();

    const MotionButton = motion(Button);
    const MotionIconButton = motion(IconButton);

    const animationProps = {
        transition: { duration: 0.1 },
        initial: { opacity: 0, scale: 0 },
        animate: {
            opacity: 1,
            scale: 1,
        },
        // exit: { opacity: 0, scale: 0 },
    };
    return (
        <HStack spacing={2}>
            <HStack spacing={2}>
                {isEditMode && (
                    <>
                        <Tooltip label={'Save'}>
                            <MotionIconButton
                                aria-label={'save widgets'}
                                icon={<Icon as={Icons.Save} />}
                                onClick={handleSaveLayout}
                                colorScheme={'purple'}
                                size={{
                                    base: 'md',
                                    sm: 'md',
                                }}
                                {...animationProps}
                            />
                        </Tooltip>

                        <Tooltip label={t('habits:addWidget')}>
                            {!isMobile ? (
                                <MotionButton
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={onOpenWidgetsDrawer}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                    {...animationProps}
                                >
                                    {t('common:add', {
                                        count: `${widgets.length ? `(${widgets.length})` : ''}`,
                                    } as any)}
                                </MotionButton>
                            ) : (
                                <MotionIconButton
                                    icon={<Icon as={Icons.Add} />}
                                    aria-label={'add-widget'}
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={onOpenWidgetsDrawer}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                    {...animationProps}
                                />
                            )}
                        </Tooltip>
                        <Tooltip label={t('common:reset')}>
                            {!isMobile ? (
                                <MotionButton
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={resetLayout}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                    {...animationProps}
                                >
                                    {t('common:reset')}
                                </MotionButton>
                            ) : (
                                <MotionIconButton
                                    icon={<Icon as={Icons.Reset} />}
                                    aria-label={'reset-grid'}
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={resetLayout}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                    {...animationProps}
                                />
                            )}
                        </Tooltip>
                    </>
                )}

                <Tooltip label={isEditMode ? t('common:close') : t('habits:editGrid')}>
                    <MotionIconButton
                        aria-label={isEditMode ? 'close' : 'edit grid'}
                        icon={<Icon as={isEditMode ? Icons.Cross : Icons.Grid} />}
                        onClick={() => setIsEditMode(!isEditMode)}
                        colorScheme={'purple'}
                        variant={'outline'}
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        {...animationProps}
                    />
                </Tooltip>
            </HStack>
        </HStack>
    );
};
