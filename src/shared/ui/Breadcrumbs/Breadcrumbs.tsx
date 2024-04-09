import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import React from 'react';

interface BreadcrumbProps {
    label: string;
    onClick?: () => void;
}

export type BreadcrumbsProps = {
    breadcrumbs: Array<BreadcrumbProps>;
};

export const Breadcrumbs = ({ items }: { items: BreadcrumbProps[] }) => (
    <Breadcrumb>
        {items.map((item, index) => (
            <BreadcrumbItem key={index} isCurrentPage={index === items.length - 1}>
                <BreadcrumbLink onClick={item.onClick}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
        ))}
    </Breadcrumb>
);
