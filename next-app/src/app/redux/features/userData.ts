
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/types'
import dayjs from 'dayjs';

type InitialState = {
    userEditId: string | null,
    userEdit: UserType | null
}

const initialState: InitialState = {
    userEditId : null,
    userEdit : null
}

export const UserData = createSlice({
    name: 'UserData',
    initialState,
    reducers: {
        UpdateUserEditId: (state, action: PayloadAction<string| null>) => {
            state.userEditId = action.payload;
        },
        UpdateUserEdit: (state, action: PayloadAction<UserType| null>) => {
            const user = action.payload;

            if (user) {
                if (user.details) {
                    user.details.birthday = user.details.birthday
                        ? dayjs(user.details.birthday)
                        : dayjs();
                }
        
                if (user.password === undefined) {
                    user.password = "";
                }
        
                state.userEdit = user
            }
        },
    }
})

export const {UpdateUserEditId, UpdateUserEdit} = UserData.actions;

export default UserData.reducer;