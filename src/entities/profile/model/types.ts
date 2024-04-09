export interface ProfileData {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
}

export type EditProfileFields = 'name' | 'surname' | 'username' | 'bio';
