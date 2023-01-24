import { useEffect, useRef } from 'react';

const useTitle = (title: string) => {
    const documentDefined = typeof document !== 'undefined';
    const originalTitle = useRef(documentDefined ? document.title : null);

    useEffect(() => {
        if (!documentDefined) return;

        if (document.title !== title) document.title = title;

        return () => {
            document.title = originalTitle.current as string;
        };
    }, []);
};

export const setTitle = (title: string) => {
    if (typeof document !== 'undefined') document.title = title;
}

export default useTitle;
