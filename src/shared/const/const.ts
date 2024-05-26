export const BREAKPOINTS = {
    sm: 20,
    md: 48,
    lg: 62,
    xl: 80,
    '2xl': 116,
};

export const MediaQueries = {
    xs: `(max-width: ${BREAKPOINTS.sm}em)`,
    sm: `(min-width: ${BREAKPOINTS.sm}em) and (max-width: ${BREAKPOINTS.md}em)`,
    md: `(min-width: ${BREAKPOINTS.md}em) and (max-width: ${BREAKPOINTS.lg}em)`,
    lg: `(min-width: ${BREAKPOINTS.lg}em) and (max-width: ${BREAKPOINTS.xl}em)`,
    '2xl': `(min-width: ${BREAKPOINTS['2xl']}em)`,
};
export const MEDIA_QUERIES = Object.values(MediaQueries);

export const colors: Array<
    'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink' | 'gray'
> = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink', 'gray'];
