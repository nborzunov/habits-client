import { Flex, Heading } from '@chakra-ui/react';
import { useMobile } from '@shared/hooks';
import { Back } from '@shared/ui/Back';
import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export const Header = ({ children, title }: PropsWithChildren<{ title: string }>) => {
    const isMobile = useMobile();

    return (
        <Flex align={'center'} justify={'space-between'} px={4} pt={2}>
            <Flex align={'center'}>
                {isMobile && (
                    <Link to={'/habits'}>
                        <Back
                            size={{
                                base: 'lg',
                                sm: 'md',
                            }}
                        />
                    </Link>
                )}
                <Heading as='h3' size='md'>
                    {title}
                </Heading>
            </Flex>

            {children}
        </Flex>
    );
};
