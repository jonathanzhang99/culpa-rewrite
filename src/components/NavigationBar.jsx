import React from "react";
import { Link } from "react-router-dom";
import { Menu, Search } from 'semantic-ui-react'

export default function NavigationBar() {
    return (
        <Menu fixed="top">
            <Menu.Item
                className="sidebar-tab"
            > 
                Side Bar
            </Menu.Item>
            <Menu.Item
                as={Link} to="/"
                className="culpa-icon"
            >
                CULPA
            </Menu.Item>
            <Menu.Item
                className="searchbar"
            >
                <Search fluid />
            </Menu.Item>
            <Menu.Item
                as={Link} to="/review"
                className="write-review-button"
            >
                Write Review
            </Menu.Item>
        </Menu>
    );
}