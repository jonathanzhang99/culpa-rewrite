import React from "react";
import { Link } from "react-router-dom";
import { Menu, Search } from 'semantic-ui-react'

export default function NavigationBar() {
    return (
        <Menu fixed="top">
            <Menu.Item> 
                <span style={{width:"5vw"}}> Side Bar </span>
            </Menu.Item>
            <Menu.Item
                as={Link} to="/"
            >
                <span style={{width:"10vw"}}> CULPA </span>
            </Menu.Item>
            <Menu.Item>
                <Search style={{width:"65vw"}} />
            </Menu.Item>
            <Menu.Item
                as={Link} to="/review"
                position="right"
            >
                <span style={{width:"20vw"}}> Write Review </span>
            </Menu.Item>
        </Menu>
    );
}