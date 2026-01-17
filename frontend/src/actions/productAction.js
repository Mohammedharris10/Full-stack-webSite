import axios from 'axios';
import { productFail, productSuccess, productRequest } from '../slices/productSlice';

// fetch single product using product id
export const getProduct = (id) => async (dispatch) => {
    try {
        dispatch(productRequest());
        // call backend api to get product data
        const { data } = await axios.get(`/api/v1/product/${id}`);
        // store product data in redux
        dispatch(productSuccess(data));
    } catch (error) {
        dispatch(productFail(error.response.data.message));
    }
}