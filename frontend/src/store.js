import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
// combine all reducers into one root reducer
// later we add userReducer, productReducer, etc
const reducer = combineReducers({
    productsState: productsReducer,
    productState: productReducer,
    authState: authReducer,
})

// create redux store
const store = configureStore({
    reducer,              // attach root reducer
})

export default store; // export store to use in app