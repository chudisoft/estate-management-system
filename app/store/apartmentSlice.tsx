import { Apartment } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchApartments = createAsyncThunk<Apartment[]>('apartment/fetchApartments', async () => {
  const response = await axios.get('/api/v1/apartments');
  return response.data;
});

export const fetchApartment = createAsyncThunk<Apartment, string>(
  'apartment/fetchApartment',
  async (id: string) => {
    const response = await axios.get<Apartment>(`/api/v1/apartments/${id}`);
    return response.data;
  }
);

export const createApartment = createAsyncThunk<Apartment, Partial<Apartment>>('apartment/createApartment', async (apartmentData) => {
  const response = await axios.post('/api/v1/apartments', apartmentData);
  return response.data;
});

export const updateApartment = createAsyncThunk<Apartment, Apartment>(
  'apartment/updateApartment',
  async (apartmentData) => {
    const { id, ...rest } = apartmentData;
    const response = await axios.put(`/api/v1/apartments/${id}`, rest);
    return response.data;
  }
);

export const deleteApartment = createAsyncThunk<string, string>('apartment/deleteApartment', async (id: string) => {
  await axios.delete(`/api/v1/apartments/${id}`);
  return id;
});

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
        state.apartments = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchApartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deleteApartment.fulfilled, (state, action) => {
        state.apartments = state.apartments.filter((firm) => firm.id !== Number(action.payload));
        state.status = 'succeeded';
      });
  },
});

export default apartmentSlice.reducer;
