import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import rentReducer from './rentSlice';
import buildingReducer from './buildingSlice';
import apartmentReducer from './apartmentSlice';
import lawfirmReducer from './lawfirmSlice';
import paymentReducer from './paymentSlice';
import bookingStatusReducer from './bookingStatusSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    rents: rentReducer,
    buildings: buildingReducer,
    apartments: apartmentReducer,
    lawfirms: lawfirmReducer,
    payments: paymentReducer,
    bookingStatuses: bookingStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
