export const localStorageEffect =
    (key: string) =>
    ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
        const savedValue = localStorage.getItem(key);
        if (savedValue != null) {
            setSelf(JSON.parse(savedValue));
        }

        onSet((newValue: string, _: any, isReset: boolean) => {
            isReset
                ? localStorage.removeItem(key)
                : localStorage.setItem(key, JSON.stringify(newValue));
        });
    };
