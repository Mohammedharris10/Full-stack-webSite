import MetaData from "./layouts/MetaDate"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../actions/productsActions";

export default function Home() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts)
    },[])
    return (
        <>
        <MetaData title={"Home"} />    
            <div className="container mt-4">
                <h2 id="products_heading">Latest Products</h2>

                <div className="row mt-4">

                    {/* Product 1 */}
                    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
                        <div className="card p-3 rounded">
                            <img
                                className="card-img-top mx-auto"
                                src="./images/products/1.jpg"
                                alt="OPPO"
                            />

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">
                                    <a href="#">
                                        OPPO F21s Pro 5G (Dawnlight Gold, 8GB RAM, 128 Storage)
                                    </a>
                                </h5>

                                <div className="ratings mt-auto">
                                    <div className="rating-outer">
                                        <div
                                            className="rating-inner"
                                            style={{ width: "80%" }}
                                        ></div>
                                    </div>
                                    <span id="no_of_reviews">(5 Reviews)</span>
                                </div>

                                <p className="card-text mt-2">$245.67</p>

                                <a href="#" id="view_btn" className="btn btn-block">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}