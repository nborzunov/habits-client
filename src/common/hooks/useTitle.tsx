import { useEffect, useRef } from 'react';

const useTitle = (title: string) => {
    const documentDefined = typeof document !== 'undefined';
    const originalTitle = useRef(documentDefined ? document.title : null);

    useEffect(() => {
        if (!documentDefined) return;

        if (document.title !== title) document.title = title;

        return () => {
            // eslint-disable-next-line
            document.title = originalTitle.current as string;
        };
    }, [documentDefined, title]);
};

export const setTitle = (title: string) => {
    if (typeof document !== 'undefined') document.title = title;
};

export default useTitle;
