import React from 'react';
import { Link, IndexLink } from 'react-router';
import logo from '../common/logo.svg';


const Header = () => (
    <div>
        <div className="App">

        </div>
        <div className="text-center">
            <br/>

            <nav className="navbar navbar-default">
                <br/>
                <IndexLink to="/" activeClassName="active">Home</IndexLink>
                {" | "}
                <Link to="/prodList" activeClassName="active">All Products</Link>
                {" | "}
                <Link to="/" activeClassName="active">Create Product</Link>
                {" | "}
                <Link to="/" activeClassName="active">Search</Link>
            </nav>
        </div>
    </div>
);

export default Header;
