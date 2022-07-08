import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TUserLocation = {
  id: string;
  value: string;
};

interface IUserState {
  id: number;
  username: string;
  userRole: string;
  location: TUserLocation;
  isAuth: boolean;
}

export interface IUserPayload extends IUserState {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expiry_date: number;
}

const initialState: IUserState = {
  id: 5,
  isAuth: false,
  username: 'Test UserName',
  userRole: 'Reader',
  location: {
    id: '2',
    value: 'Gomel',
  },
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUser: (state: IUserState, action: PayloadAction<IUserPayload>) => {
      const { username, location, id, userRole } = action.payload;

      state.location = location;
      state.id = id;
      state.isAuth = true;
      state.location = location;
      state.userRole = userRole;
    },
    updateUserLocation: (
      state: IUserState,
      action: PayloadAction<TUserLocation>
    ) => {
      state.location = action.payload;
    },
    logout: (state: IUserState) => {
      state.isAuth = false;
    },
  },
});

export const { setUser, updateUserLocation, logout } = userSlice.actions;

export default userSlice.reducer;
