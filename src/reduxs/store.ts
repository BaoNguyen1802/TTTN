import { configureStore, ThunkDispatch, AnyAction, Store } from '@reduxjs/toolkit'
import rootReducer from './rootReducers';

export type RootState = ReturnType<typeof store.getState>
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
  dispatch: AppThunkDispatch;
};

const store = configureStore({
  devTools: true,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

export default store