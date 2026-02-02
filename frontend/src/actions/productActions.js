import axios from 'axios';
import { productsFail, productsRequest, productsSuccess } from '../slices/productsSlice';
import { productFail, productSuccess, productRequest } from '../slices/productSlice';


export const getProducts = (pageNo,price=null,category=null,keyword=null) => async (dispatch) => {
    try {
        // set loading state before api call
        dispatch(productsRequest());
        let url = `/api/v1/products?page=${pageNo}`;
        if(keyword){
            url = url + `&keyword=${keyword}`;
        }

        if(price){
            url = url + `&price[gte]=${price[0]}&price[lte]=${price[1]}`;   
        }

        if(category){
            url = url + `&category=${category}`;   
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