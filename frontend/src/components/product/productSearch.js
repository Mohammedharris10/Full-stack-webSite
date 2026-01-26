import MetaData from ".././layouts/MetaDate"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from ".././layouts/Loader";
import Product from ".././product/Product";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { getProducts } from "../../actions/productsActions";
import Pagination from "react-js-pagination";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";



export default function ProductSearch() {

    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const { keyword } = useParams();

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
        setSearchParams({ page: pageNo })
    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: "bottom-center",
            })
        }
        dispatch(getProducts(page, keyword));
    }, [error, dispatch, page, keyword])
    
    return (
        <>{loading ? <Loader /> : <>
            <MetaData title={"Home"} />
            <div className="container mt-4">
                <h2 id="products_heading">Searched Products</h2>

                <div className="row mt-4">
                    {products && products.map(product => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
                {productsCount > resPerPage ?
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination
                            activePage={currentPage}
                            onChange={setCurrentPageNo}
                            totalItemsCount={productsCount}
                            itemsCountPerPage={resPerPage}
                            nextPageText={"Next"}
                            lastPageText={"Last"}
                            firstPageText={"First"}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div> : null}
            </div>
        </>}
        </>
    )
}