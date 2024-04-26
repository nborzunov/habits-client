export interface User {
    id: string;
    username?: string;
    email: string;
    name?: string;
    surname?: string;
    bio?: string;
    image?: string;
    emailVerified: boolean;
    active: boolean;
    created_date: Date;
    updatedDate: Date;
}
