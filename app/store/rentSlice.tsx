import { Rent } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRents = createAsyncThunk('rent/fetchRents', async () => {
  const response = await axios.get('/api/v1/rents');
  return response.data;
});

// Create the async thunk
export const fetchRent = createAsyncThunk<Rent, string>(
  'rent/fetchRent',
  async (id: string) => {
    const response = await axios.get<Rent>(`/api/v1/rents/${id}`);
    return response.data;
  }
);

export const createRent = createAsyncThunk('rent/createRent', async (rentData) => {
  const response = await axios.post('/api/v1/rents', rentData);
  return response.data;
});

export const updateRent = createAsyncThunk(
    'rent/updateRent',
    async (rentData: Rent) => {
      const { id, ...rest } = rentData;
      const response = await axios.put(`/api/v1/rents/${id}`, rest);
      return response.data;
    }
  );
  

  interface RentState {
    rents: Rent[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  const initialState: RentState = {
    rents: [],
    status: 'idle',
    error: null,
  };
  
  const rentSlice = createSlice({
    name: 'rent',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchRents.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchRents.fulfilled, (state, action) => {
          const allRents = action.payload;
          state.rents = allRents;
          state.status = 'succeeded';
        })
        .addCase(fetchRents.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || null; // Handle error message
        });
    },
  });
  
export default rentSlice.reducer;
