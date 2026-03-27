export type UpdateUserDto = {
    userId: string; 
    isDisplay?: boolean; 
    email: string; 
    username: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    role?: string[]; 
    phoneNumber?: string; 
    birthday?: Date;
    address?: string; 
    gender?: string; 
};
