import { Payment } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPayments = createAsyncThunk('payment/fetchPayments', async () => {
  const response = await axios.get('/api/v1/payments');
  return response.data;
});

// Create the async thunk
export const fetchPayment = createAsyncThunk<Payment, string>(
  'payment/fetchPayment',
  async (id: string) => {
    const response = await axios.get<Payment>(`/api/v1/payments/${id}`);
    return response.data;
  }
);

export const createPayment = createAsyncThunk('payment/createPayment', async (paymentData) => {
  const response = await axios.post('/api/v1/payments', paymentData);
  return response.data;
});

export const updatePayment = createAsyncThunk(
    'payment/updatePayment',
    async (paymentData: Payment) => {
      const { id, ...rest } = paymentData;
      const response = await axios.put(`/api/v1/payments/${id}`, rest);
      return response.data;
    }
  );
  
interface PaymentState {
  payments: Payment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  status: 'idle',
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        const allPayments = action.payload;
        state.payments = allPayments;
        state.status = 'succeeded';
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null; // Handle error message
      });
  },
});

export default paymentSlice.reducer;
