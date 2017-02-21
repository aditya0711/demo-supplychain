import React, { Component } from 'react';
import logo from '../common/logo.svg';
import './addProduct.css';
import $ from 'jquery';
import uuid from 'node-uuid';
import '../common/App.css';

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {
                id : uuid.v1(),
                name : "",
                description : "",
                location: "",
                date : ""
            }
        }
    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to PirateCon</h2>
                </div>
                <div className="App-intro">
                    <br /><br />
                    <p/><p/>
                    <div id="content">

                        <form onSubmit={this.handleSubmit} id="form1">
                            <center>
                                <h2 id="heading-form">Add Product</h2>
                                <hr id="hr1"  />
                                <br />
                            </center>
                            <label>Product ID :</label><br /><input disabled="true" type="text" id="id" value={this.state.product.id} onChange={this.handleChange} /><br/><br/>
                            <label>Product Name :</label><br /><input type="text" id="name" value={this.state.product.name} onChange={this.handleChange} /><br/><br/>
                            <label>Product Description :</label><br /><input type="text" id="description" value={this.state.product.description}  onChange={this.handleChange} /><br/><br/>
                            <label>Manufacturing Date :</label><br /><input type="date" id="date" value={this.state.product.date} onChange={this.handleChange} /><br/><br/>
                            <label>Manufacturing Location :</label><br /><input type="text" id="location" value={this.state.product.location} onChange={this.handleChange} /><br/><br/>
                            <center>
                                <button type="submit" id="btn1">
                                    Add Product
                                </button>
                            </center>
                        </form>
                        <br /><br />
                    </div>
                </div>
            </div>
        );
    }
    handleChange = (e) => {

        let newState = {
            product: {
                id: this.state.product.id,
                name: this.state.product.name,
                description: this.state.product.description,
                location: this.state.product.location,
                date: this.state.product.date
            }};
        console.log("New State: " + JSON.stringify(newState));
        newState.product[e.target.id] = e.target.value;
        console.log("Target Name: " + e.target.name +  "Target Value: " + e.target.value)
        this.setState(newState);
    };

    handleSubmit = (e) => {
        e.preventDefault();

        let formData = {
            id          : this.state.product.id,
            name        : this.state.product.name,
            description : this.state.product.description,
            location    : this.state.product.location,
            date        : this.state.product.date,
        }
        console.log("**FORM DATA**" + JSON.stringify(formData))
        $.ajax({
            url: 'http://localhost:3001/api/v1/product/create',
            dataType: 'text',
            type: 'POST',
            data: formData,
            crossDomain: true,
            success: function(data) {
                if (confirm('data: ' + data)) {
                    console.log(JSON.stringify(data));
                    //document.querySelector('.form-input').val('');
                }
            },
            error: function(xhr, status, err) {
                console.error(status, err.toString());
                alert('There was some problem with sending your message.');
            }
        });

        this.setState = {
            product: {
                id          : this.state.product.id,
                name        : "",
                description : "",
                location    : "",
                date        : ""
            }
        }

        console.log("*Product*" + JSON.stringify(this.state));
    }

}

export default AddProduct;