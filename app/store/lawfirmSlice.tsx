import { LawFirm } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLawFirms = createAsyncThunk<LawFirm[]>('lawfirm/fetchLawFirms', async () => {
  const response = await axios.get('/api/v1/lawfirms');
  return response.data;
});

export const fetchLawFirm = createAsyncThunk<LawFirm, string>(
  'lawfirm/fetchLawFirm',
  async (id: string) => {
    const response = await axios.get<LawFirm>(`/api/v1/lawfirms/${id}`);
    return response.data;
  }
);

export const createLawFirm = createAsyncThunk<LawFirm, Partial<LawFirm>>('lawfirm/createLawFirm', async (lawfirmData) => {
  const response = await axios.post('/api/v1/lawfirms', lawfirmData);
  return response.data;
});

export const updateLawFirm = createAsyncThunk<LawFirm, LawFirm>(
  'lawfirm/updateLawFirm',
  async (lawfirmData) => {
    const { id, ...rest } = lawfirmData;
    const response = await axios.put(`/api/v1/lawfirms/${id}`, rest);
    return response.data;
  }
);

interface LawFirmState {
  lawfirms: LawFirm[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LawFirmState = {
  lawfirms: [],
  status: 'idle',
  error: null,
};

const lawfirmSlice = createSlice({
  name: 'lawfirm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLawFirms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLawFirms.fulfilled, (state, action) => {
        const allLawFirms = action.payload;
        state.lawfirms = allLawFirms;
        state.status = 'succeeded';
      })
      .addCase(fetchLawFirms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null; // Handle error message
      });
  },
});

export default lawfirmSlice.reducer;
