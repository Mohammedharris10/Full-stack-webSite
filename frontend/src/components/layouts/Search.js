import { useNavigate } from "react-router-dom"
import { useState } from "react";

export default function Search() {

    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("")

    const searchHandler = (e) => {
        e.preventDefault();
        navigate(`/search/${keyword}`);
    }

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