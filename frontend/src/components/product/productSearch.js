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
import Slider from "rc-slider"
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip"
import 'rc-tooltip/assets/bootstrap.css';

export default function ProductSearch() {

    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000])
    const [priceChanged, setPriceChanged] = useState(price)

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
        dispatch(getProducts(page,priceChanged, keyword));
    }, [error, dispatch, page, keyword, priceChanged])

    return (
        <>{loading ? <Loader /> : <>
            <MetaData title={"Searched Product"} />
            <div className="container mt-4">
                <h2 id="products_heading">Searched Products</h2>

                <div className="row">
                    <div className="col-6 col-md-3 mb-5 mt-5">
                        <div className="px-5" onMouseUp={() =>setPriceChanged(price)}>
                            <Slider
                                range={true}
                                marks={{ 1: `$1`, 1000: `$1000` }}
                                min={1}
                                max={1000}
                                defaultValue={price}
                                onChange={(price)=>{
                                    setPrice(price)
                                }}
                                handleRender={ //~~~~~~
                                    renderProps => {
                                        return (
                                            <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`} placement="top">
                                                <div {...renderProps.props}></div>
                                            </Tooltip>
                                        )
                                    }
                                }
                            />

                        </div>
                    </div>
                    <div className="col-6 col-md-9">
                        <div className="row">
                            {products && products.map(product => (
                                <Product key={product._id} col={4} product={product} />
                            ))}
                        </div>
                    </div>

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