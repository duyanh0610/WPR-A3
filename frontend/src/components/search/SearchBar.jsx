import React from "react";
import "./SearchBar.css"

const SearchBar = (props) => { 
    return  <div id="search">
    <input 
        className="search-bar"
        type="text" 
        placeholder="Search..."
        value ={props.value}
        onChange={props.onChange} />
</div>
}

export default SearchBar