import { User } from '@app/types';
import { atom } from 'recoil';

export const activeUserState = atom<User | null>({
    key: 'activeUserState',
    default: null,
});
