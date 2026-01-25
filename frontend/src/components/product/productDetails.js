
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getProduct } from "../../actions/productAction";
import { useSelector } from "react-redux";
import Loader from "../layouts/Loader";
import { Carousel } from 'react-bootstrap';
import MetaData from "../layouts/MetaDate";
// import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetails = () => {
  const { loading, product, error } = useSelector(
    (state) => state.productState
  );
  // get dispatch function from redux
  const dispatch = useDispatch();

  // get product id from url params
  const { id } = useParams();

  useEffect(() => {

    // call api to get single product details
    dispatch(getProduct(id));

  }, [id, dispatch]); // run only once when component loads


  // if loading → show loader
  // else if error → show error message
  // else if product exists → show product details
  return (<>
    {loading ? <Loader /> : error ? <div className="alert alert-danger">{error}</div> : product && product.name ? (
      <div className="container py-5">
        <MetaData title={product.name}/>
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center mb-4">
            <Carousel pause= 'hover'>
              {product.images && product.images.map(image =>
                <Carousel.Item key={image._id}>
                  <img
                    src={`/${image.image}`}
                    alt={`This is ${product.name} image`}
                    className="img-fluid border rounded"
                    style={{ maxHeight: "430px", objectFit: "contain" }}
                  />
                </Carousel.Item>
              )}
            </Carousel>

          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">
              {product.name}
            </h2>

            <p className="text-muted small">Product #{product._id}</p>
            <div className="d-flex align-items-center mb-2">
              <div className="rating-outer">
                <div
                  className="rating-inner"
                  style={{ width: `${product.ratings / 5 * 100}%` }}
                ></div>
              </div>
              <span className="ms-2 text-muted">({product.numOfReviews} Reviews)</span>
            </div>

            <h3 className="fw-bold text-dark mb-4">${product.price}</h3>

            {/* Quantity + Add to Cart */}
            <div className="d-flex align-items-center mb-4">
              <button className="btn btn-danger px-3">−</button>
              <input
                type="text"
                value="1"
                readOnly
                className="form-control text-center mx-2"
                style={{ width: "60px" }}
              />
              <button className="btn btn-primary px-3">+</button>

              <button className="btn btn-warning ms-3 px-4 fw-bold">
                Add to Cart
              </button>
            </div>

            {/* Status */}
            <p className="fs-6">
              <strong>Status:</strong> <span style={{ color: product.stock > 0 ? "green" : "red" }} className="text-success">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
            </p>

            {/* Description */}
            <h5 className="fw-bold mt-4">Description:</h5>
            <p className="text-muted">
              {product.description}
            </p>

            <p className="mt-4">
              <strong>Sold by:</strong> <span className="text-primary">{product.seller}</span>
            </p>

            {/* Review Button */}
            <button className="btn btn-outline-warning mt-3 fw-bold">
              Submit Your Review
            </button>
          </div>
        </div>
      </div>) : <div>Product not found</div>}</>

  );
};

export default ProductDetails;
