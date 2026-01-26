import axios from 'axios';
import { productsFail, productsRequest, productsSuccess } from '../slices/productsSlice';

export const getProducts = (pageNo,keyword) => async (dispatch) => {
    try {
        // set loading state before api call
        dispatch(productsRequest());
        let url = `/api/v1/products?page=${pageNo}`;
        if(keyword){
            url = url + `&keyword=${keyword}`;
        }
        // call backend api to fetch all products
        const { data } = await axios.get(url);

        // store products data in redux store
        dispatch(productsSuccess(data));
    }
    catch (error) {
        dispatch(productsFail(error.response.data.message))
    }
}