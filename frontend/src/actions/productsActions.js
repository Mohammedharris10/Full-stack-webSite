import axios from 'axios';
import { productsFail, productsRequest, productsSuccess } from '../slices/productsSlice';

export const getProducts = (pageNo) => async (dispatch) => {
    try {
        // set loading state before api call
        dispatch(productsRequest());

        // call backend api to fetch all products
        const { data } = await axios.get(`/api/v1/products?page=${pageNo}`);

        // store products data in redux store
        dispatch(productsSuccess(data));
    }
    catch (error) {
        dispatch(productsFail(error.response.data.message))
    }
}