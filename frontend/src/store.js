import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import productReducer from "./slices/productSlice";
// combine all reducers into one root reducer
// later we add userReducer, productReducer, etc
const reducer = combineReducers({
    productsState: productsReducer,
    productState: productReducer,
})

// create redux store
const store = configureStore({
    reducer,              // attach root reducer
})

export default store; // export store to use in app