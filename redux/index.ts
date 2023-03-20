import storage from '../utils/storages/WebStorage'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import counterReducer from '../redux/CounterSlice'
import authReducer from '../redux/AuthSlice'

// const secureStorage = createSecureStorage()
const reducers = combineReducers({
	counter: counterReducer,
	auth: authReducer,
	// other reducers goes here...
})
// const secureReducers = combineReducers({
// 	token: tokenReducer,
// 	// other reducers goes here...
// })
const persistConfig = {
	key: 'root',
	version: 1,
	storage: storage,
	//  stateReconciler: hardSet,
}
// const securePersistConfig = {
// 	key: 'secure',
// 	storage: secureStorage,
// }

const allReducer = combineReducers({
	main: persistReducer(persistConfig, reducers),
	// secure: persistReducer(securePersistConfig, secureReducers),
})
// const persistedReducer = persistReducer(persistConfig, reducers)
const store = configureStore({
	reducer: allReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export { store, persistor }
