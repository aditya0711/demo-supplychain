import React from 'react';
import { Link } from 'react-router';

const HomePage = () => (
    <div className="jumbotron">
        <h1 className="lead">Welcome to Pirate Con!!</h1>
        <h2 className="lead">Track all your products down the SupplyChain</h2>
        <div>
            <Link to="library">
                <button className="btn btn-lg btn-primary"> Add a Product</button>
            </Link>
        </div>
    </div>
);

export default HomePage;
