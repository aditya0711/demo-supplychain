/**
 * Created by Manish on 2/18/2017.
 */
import React  from 'react';
import {Link} from 'react-router';

const NavPage = (props) => {
    return (
        <div className="container">
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">PirateCON</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li><Link to="/addProduct">AddProduct</Link></li>
                            <li><Link to="/prodList">ProdList</Link></li>

                        </ul>
                    </div>
                </div>
            </nav>
            {/* Each smaller components */}
            {props.children}
        </div>
    );
};

export default NavPage;