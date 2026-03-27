import type { Dayjs } from 'dayjs'

export type UserDetailType = {
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    birthday?: Date | Dayjs; 
    address?: string;
    gender?: string;
    imgDisplay?: string;
};


export type UserType = {
    id?: number;
    email: string;
    secretKey: string;
    isDisplay?: boolean;
    password?: string,
    username?: string;
    role?: string[];
    details?: UserDetailType;
    actionLog?: any[];
    created_at: Date;
    updated_at: Date;
};