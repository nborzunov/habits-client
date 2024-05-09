import { Center, Spinner } from '@chakra-ui/react';
import { PropsWithChildren, Suspense } from 'react';

export const Loader = ({ children }: PropsWithChildren) => {
    return (
        <Suspense
            fallback={
                <Center width={'100%'} height={'100vh'}>
                    <Spinner size='xl' color={`purple.500`} />
                </Center>
            }
        >
            {children}
        </Suspense>
    );
};
