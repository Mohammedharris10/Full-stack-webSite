import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react";
import { useEffect } from "react";

export default function Search() {

    // hook to navigate pages
    const navigate = useNavigate();

    // get current url location
    const location = useLocation();

    // state to store search keyword
    const [keyword, setKeyword] = useState("");

    // handle search submit
    const searchHandler = (e) => {
        e.preventDefault(); // stop page reload
        navigate(`/search/${keyword}`); // go to search page
    }

    const clearSearch = () => {
        setKeyword("")
    }

    useEffect(() => {
        // if user comes back to home page, clear the search input
        if (location.pathname === '/') {
            clearSearch();
        }
    }, [location])



    // two-way binding means:
    // input changes → state updates
    // state changes → input value updates
    return (
        <form onSubmit={searchHandler}>  //form submit will trigger searchHandler
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    onChange={(e) => setKeyword(e.target.value)} //update keyword state on input change
                    value={keyword} //bind input value to keyword state
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
    )
}