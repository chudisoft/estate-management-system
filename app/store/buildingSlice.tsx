import { Building } from '@prisma/client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBuildings = createAsyncThunk('building/fetchBuildings', async () => {
  const response = await axios.get('/api/v1/buildings');
  return response.data;
});

// Create the async thunk
export const fetchBuilding = createAsyncThunk<Building, string>(
  'building/fetchBuilding',
  async (id: string) => {
    const response = await axios.get<Building>(`/api/v1/buildings/${id}`);
    return response.data;
  }
);

export const createBuilding = createAsyncThunk('building/createBuilding', async (buildingData) => {
  const response = await axios.post('/api/v1/buildings', buildingData);
  return response.data;
});

export const updateBuilding = createAsyncThunk(
    'building/updateBuilding',
    async (buildingData: Building) => {
      const { id, ...rest } = buildingData;
      const response = await axios.put(`/api/v1/buildings/${id}`, rest);
      return response.data;
    }
  );
  

  interface BuildingState {
    buildings: Building[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  const initialState: BuildingState = {
    buildings: [],
    status: 'idle',
    error: null,
  };
  
  const buildingSlice = createSlice({
    name: 'building',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchBuildings.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(fetchBuildings.fulfilled, (state, action) => {
          const allBuildings = action.payload;
          state.buildings = allBuildings;
          state.status = 'succeeded';
        })
        .addCase(fetchBuildings.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || null; // Handle error message
        });
    },
  });
  
export default buildingSlice.reducer;
