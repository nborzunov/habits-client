import { Button, HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { useMobile } from '@shared/hooks';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

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
    return (
        <HStack spacing={2}>
            <HStack spacing={2}>
                {isEditMode && (
                    <>
                        <Tooltip label={'Save'}>
                            <IconButton
                                aria-label={'save widgets'}
                                icon={<Icon as={Icons$.Save} />}
                                onClick={handleSaveLayout}
                                colorScheme={'purple'}
                                size={{
                                    base: 'md',
                                    sm: 'md',
                                }}
                            />
                        </Tooltip>

                        <Tooltip label={t('habits:addWidget')}>
                            {!isMobile ? (
                                <Button
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={onOpenWidgetsDrawer}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                >
                                    {t('common:add', {
                                        value: `${widgets.length ? `(${widgets.length})` : ''}`,
                                    })}
                                </Button>
                            ) : (
                                <IconButton
                                    icon={<Icon as={Icons$.Add} />}
                                    aria-label={'add-widget'}
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={onOpenWidgetsDrawer}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                />
                            )}
                        </Tooltip>
                        <Tooltip label={t('common:reset')}>
                            {!isMobile ? (
                                <Button
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={resetLayout}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                >
                                    {t('common:reset')}
                                </Button>
                            ) : (
                                <IconButton
                                    icon={<Icon as={Icons$.Reset} />}
                                    aria-label={'reset-grid'}
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                    onClick={resetLayout}
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                />
                            )}
                        </Tooltip>
                    </>
                )}

                <Tooltip label={isEditMode ? t('common:close') : t('habits:editGrid')}>
                    <IconButton
                        aria-label={isEditMode ? 'close' : 'edit grid'}
                        icon={<Icon as={isEditMode ? Icons$.Cross : Icons$.Grid} />}
                        onClick={() => setIsEditMode(!isEditMode)}
                        colorScheme={'purple'}
                        variant={'outline'}
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                    />
                </Tooltip>
            </HStack>
        </HStack>
    );
};
