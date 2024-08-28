import { User } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk<User[]>('user/fetchUsers', async () => {
  const response = await axios.get('/api/v1/users');
  return response.data;
});

export const fetchUser = createAsyncThunk<User, string>(
  'user/fetchUser',
  async (id: string) => {
    const response = await axios.get<User>(`/api/v1/users/${id}`);
    return response.data;
  }
);

export const createUser = createAsyncThunk<User, Partial<User>>('user/createUser', async (userData) => {
  const response = await axios.post('/api/v1/users', userData);
  return response.data;
});

export const updateUser = createAsyncThunk<User, User>(
  'user/updateUser',
  async (userData) => {
    const { id, ...rest } = userData;
    const response = await axios.put(`/api/v1/users/${id}`, rest);
    return response.data;
  }
);

interface UserState {
  users: User[];
  managers: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  managers: [],
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const allUsers = action.payload;
        state.users = allUsers;
        state.managers = allUsers.filter(user => user.role === 'manager');
        state.status = 'succeeded';
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null; // Handle error message
      });
  },
});

export default userSlice.reducer;
