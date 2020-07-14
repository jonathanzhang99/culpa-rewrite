import React from "react";

import SearchBar from "components/SearchBar"

export default function NavigationBar() {
    return (
        <ul>
            <li>Side Bar</li>
            <li><a href="/"> CULPA </a></li>
            <li><SearchBar /></li>
            <li><a href="/review"> Write Review </a></li>
        </ul>
    );
}