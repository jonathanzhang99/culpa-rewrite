import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Menu, Search } from 'semantic-ui-react'

import "../styles/navigationBar.css";

export default function NavigationBar({ children }) {
    return (
        <Menu fixed="top">
            <Menu.Item
                className="sidebar-tab-container"
            > 
                <Icon name="bars" fitted size="big" color="blue"/>
            </Menu.Item>
            <Menu.Item
                as={Link} to="/"
                className="culpa-logo-container"
            >
                <h1> CULPA </h1>
            </Menu.Item>
            <Menu.Item
                className="searchbar-container"
            >
                <Search className="searchbar" fluid placeholder="Search for professors or courses." />
            </Menu.Item>
            <Menu.Item
                as={Link} to="/review"
                className="review-button-container"
            >
                <Button className="review-button" color="yellow"> WRITE A REVIEW </Button>
            </Menu.Item>
        </Menu>
    );
}
