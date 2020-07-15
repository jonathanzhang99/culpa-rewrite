import React from "react";
import { Link } from "react-router-dom";
import { Menu, Grid } from 'semantic-ui-react'

import SearchBar from "components/SearchBar"

export default function NavigationBar() {
    return (
        <Menu fixed="top">
            <Menu.Item> 
                Side Bar 
            </Menu.Item>
            <Menu.Item
                as={Link} to="/"
            >
                CULPA
            </Menu.Item>
            <Menu.Item>
                <SearchBar />
            </Menu.Item>
            <Menu.Item
                as={Link} to="/review"
                position="right"
            >
                Write Review 
            </Menu.Item>
        </Menu>
    );
}