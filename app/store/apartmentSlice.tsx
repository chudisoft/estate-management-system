import { Apartment } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchApartments = createAsyncThunk('apartment/fetchApartments', async () => {
  const response = await axios.get('/api/v1/apartments');
  return response.data;
});

// Create the async thunk
export const fetchApartment = createAsyncThunk<Apartment, string>(
  'apartment/fetchApartment',
  async (id: string) => {
    const response = await axios.get<Apartment>(`/api/v1/apartments/${id}`);
    return response.data;
  }
);

export const createApartment = createAsyncThunk('apartment/createApartment', async (apartmentData) => {
  const response = await axios.post('/api/v1/apartments', apartmentData);
  return response.data;
});

export const updateApartment = createAsyncThunk(
    'apartment/updateApartment',
    async (apartmentData: Apartment) => {
      const { id, ...rest } = apartmentData;
      const response = await axios.put(`/api/v1/apartments/${id}`, rest);
      return response.data;
    }
  );

  interface ApartmentState {
    apartments: Apartment[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  const initialState: ApartmentState = {
    apartments: [],
    status: 'idle',
    error: null,
  };
  
  const apartmentSlice = createSlice({
    name: 'apartment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchApartments.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchApartments.fulfilled, (state, action) => {
          const allApartments = action.payload;
          state.apartments = allApartments;
          state.status = 'succeeded';
        })
        .addCase(fetchApartments.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || null; // Handle error message
        });
    },
  });

export default apartmentSlice.reducer;
