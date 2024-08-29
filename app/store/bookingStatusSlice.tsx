import { BookingStatus } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBookingStatuses = createAsyncThunk<BookingStatus[]>('bookingStatus/fetchBookingStatuses', async () => {
  const response = await axios.get('/api/v1/bookingstatuses');
  return response.data;
});

export const fetchBookingStatus = createAsyncThunk<BookingStatus, string>(
  'bookingStatus/fetchBookingStatus',
  async (id: string) => {
    const response = await axios.get<BookingStatus>(`/api/v1/bookingstatuses/${id}`);
    return response.data;
  }
);

export const createBookingStatus = createAsyncThunk<BookingStatus, Partial<BookingStatus>>('bookingstatus/createBookingStatus', async (bookingstatusData) => {
  const response = await axios.post('/api/v1/bookingstatuses', bookingstatusData);
  return response.data;
});

export const updateBookingStatus = createAsyncThunk<BookingStatus, BookingStatus>(
  'bookingStatus/updateBookingStatus',
  async (bookingstatusData) => {
    const { id, ...rest } = bookingstatusData;
    const response = await axios.put(`/api/v1/bookingstatuses/${id}`, rest);
    return response.data;
  }
);

interface BookingStatusState {
  bookingStatuses: BookingStatus[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingStatusState = {
  bookingStatuses: [],
  status: 'idle',
  error: null,
};

const bookingStatusSlice = createSlice({
  name: 'bookingstatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingStatuses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBookingStatuses.fulfilled, (state, action) => {
        const allBookingStatuses = action.payload;
        state.bookingStatuses = allBookingStatuses;
        state.status = 'succeeded';
      })
      .addCase(fetchBookingStatuses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null; // Handle error message
      });
  },
});

export default bookingStatusSlice.reducer;
