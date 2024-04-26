import {
    Button,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
} from '@chakra-ui/react';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {};
export const SettingsDialog = createDialog(() => {
    const { t, i18n } = useTranslation();

    const dialog = useSettingsDialog();
    const [language, setLanguage] = React.useState(i18n.language);
    const handleSave = () => {
        i18n.changeLanguage(language).then(() => {
            localStorage.setItem('lang', language);
            dialog.hide();
        });
    };
    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide}>
            <ModalOverlay />
            <ModalContent mx={4}>
                <ModalHeader>{t('common:settings')}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>{t('profile:language')}</FormLabel>
                        <Select
                            isRequired
                            placeholder='Select language'
                            colorScheme={'purple'}
                            value={language}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setLanguage(e.target.value);
                                }
                            }}
                        >
                            <option value='un'>English</option>
                            <option value='ru'>Русский</option>
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme='blue'
                        mr={3}
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={dialog.hide}
                    >
                        {t('common:close')}
                    </Button>
                    <Button
                        colorScheme='green'
                        type='submit'
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={handleSave}
                    >
                        {t('common:saveChanges')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});

export const openSettingsDialog = (props: Props) =>
    openDialog(SettingsDialog, {
        id: 'Settings',
        ...props,
    });

export const useSettingsDialog = () => useDialog(SettingsDialog);
