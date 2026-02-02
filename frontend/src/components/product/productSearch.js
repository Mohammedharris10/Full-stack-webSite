import MetaData from "../layouts/MetaData"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from ".././layouts/Loader";
import Product from ".././product/Product";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { getProducts } from "../../actions/productActions";
import Pagination from "react-js-pagination";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Slider from "rc-slider"
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip"
import 'rc-tooltip/assets/bootstrap.css';
import { set } from "mongoose";

export default function ProductSearch() {

    const dispatch = useDispatch();
    // get products state from redux store
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState)
 
    // state variables for price range, category, rating and current page
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000])
    const [priceChanged, setPriceChanged] = useState(price)
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState(0);

    // access query params from url (?page=2)
    const [searchParams, setSearchParams] = useSearchParams();

    // get page number from url, default is 1
    const page = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : 1;

    // get keyword from url params (/search/:keyword)
    const { keyword } = useParams();

    const categories = [
        'Electronics',
        "Mobile Phones",
        'Laptops',
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home"
    ]

    // function to set current page number
    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
        setSearchParams({ page: pageNo })
    }

    // useEffect to fetch products based on filters and handle errors
    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: "bottom-center",
            })
        }
        dispatch(getProducts(page, priceChanged, category, keyword, rating));
    }, [error, dispatch, page, keyword, priceChanged, category, rating]) //if any variables change the value in this list, this useEffect will executes again)

    return (
        <>{loading ? <Loader /> : <>
            <MetaData title={"Searched Product"} />
            <div className="container mt-4">
                <h2 id="products_heading">Searched Products</h2>

                <div className="row">
                    <div className="col-6 col-md-3 mb-5 mt-5">
                        {/* Range Filter */}
                        <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                            <Slider
                                range={true}
                                marks={{ 1: `$1`, 1000: `$1000` }}
                                min={1}
                                max={1000}
                                defaultValue={price}
                                onChange={(price) => {
                                    setPrice(price)
                                }}
                                
                                handleRender={ //~~~~~~
                                    // custom tooltip for slider handle
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
                        <hr className="my-5" />
                        {/* Category Filter */}
                        <div className="mt-5">
                            <h3 className="mb-3">Categories</h3>
                            <ul className="pl-0">
                                {categories.map(category =>
                                    <li
                                        style={{
                                            cursor: "pointer",
                                            listStyleType: "none"
                                        }}
                                        key={category}
                                        onClick={() => {
                                            setCategory(category)

                                        }} // set category filter
                                    >
                                        {category}
                                    </li>)}
                            </ul>
                        </div>
                        <hr className="my-5" />
                        {/* Rating Category */}
                        <div className="mt-5">
                            <h3 className="mb-3">Rating Category</h3>
                            <ul className="pl-0">
                                {[5, 4, 3, 2, 1].map(star =>
                                    <li
                                        style={{
                                            cursor: "pointer",
                                            listStyleType: "none"
                                        }}
                                        key={star}
                                        onClick={() => setRating(star)} // set rating filter
                                    >
                                        <div className="rating-outer">
                                            <div className="rating-inner" style={{
                                                width: `${star * 20}%`
                                            }}>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </ul>
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