import React, { Component } from 'react';
import logo from '../common/logo.svg';
import '../common/App.css';
import $ from 'jquery';
import uuid from 'node-uuid';
import { Link, IndexLink } from 'react-router';


class ProdList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [
                {
                    "id" : "123123",
                    "name": "123123",
                    "description" : "123123"
                }
            ]
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to PirateCon</h2>
                </div>
                <div className="App-intro">
                    <br /><br />
                    <p/><p/>
                    <div id="content">
                        <center>
                            <h2 id="heading-form">Product List</h2>
                            <hr id="hr1"/>
                            <br />
                            <div className="fixedDataTableLayout_main">
                                <table className="table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Product Description</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th>{this.state.productList[0].id}</th>
                                        <th>{this.state.productList[0].name}</th>
                                        <th>{this.state.productList[0].description}</th>
                                    </tr></tbody>
                                </table>
                            </div>
                            <button className="btn btn-primary" onClick={this.redirect} type="submit" >Get List</button>
                        </center>
                    </div>
                </div>
            </div>
        );
    }
    redirect = (e) => {
        e.preventDefault();
        $.ajax({
            url: 'http://localhost:3001/api/v1/product/',
            type: 'GET',
            crossDomain: true,
            success: function(result) {
                if (confirm('list: ' + result)) {
                    //console.log(JSON.stringify(data));
                    var len =  result.data.products.length;
                    var products = result.data.products;
                    console.log("Length of array "+JSON.stringify(len));
                    this.setState = {
                        productList: [
                            {
                            "id" : products[0].id,
                            "name" : products[0].name,
                            "description" : products[0].description
                        }
                        ]
                    }
                    console.log(this.state);
                    //document.querySelector('.form-input').val('');
                }
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
                alert('There was some problem with sending your message.');
            }
        });
    }
}
export default ProdList;