import MetaData from "./layouts/MetaDate"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "./layouts/Loader";
import Product from "./product/Product";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { getProducts } from "../actions/productsActions";

export default function Home() {

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.productsState)

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: "bottom-center",
            })
        }
        dispatch(getProducts())
    }, [error] //if error comes from redux, this block executes again
    )
    return (
        <>{loading ? <Loader /> : <>
            <MetaData title={"Home"} />
            <div className="container mt-4">
                <h2 id="products_heading">Latest Products</h2>

                <div className="row mt-4">
                    {products && products.map(product => (
                        <Product product={product} />
                    ))}
                </div>
            </div>
        </>}
        </>
    )
}