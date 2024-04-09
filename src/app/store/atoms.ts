import { Layout } from 'react-grid-layout';
import { atom } from 'recoil';

import { localStorageEffect } from './effects';

export const layoutState = atom<{
    [key: string]: {
        desktop: Layout[];
        mobile: Layout[];
    };
}>({
    key: 'layoutState',
    default: {},
    effects: [localStorageEffect('layout')],
});

export const newLayoutState = atom<Layout[]>({
    key: 'newLayoutState',
    default: [],
});

export const newMobileLayoutState = atom<Layout[]>({
    key: 'newLayoutMobileState',
    default: [],
});
