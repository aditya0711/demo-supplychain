/**
 * Created by adityaaggarwal on 22/4/17.
 */

import React,  {  Component } from 'react';
import { connect } from 'react-redux';
import {Pagination, Col, Thumbnail, Grid, Label, Button} from 'react-bootstrap'
import QRCode from 'qrcode.react';
import { selectProduct } from '../actions/productListActions';


class ProductListSuccess extends Component {

    constructor(){
        super();
        this.handleSelectProduct = this.handleSelectProduct.bind(this);
    }

    handleSelectProduct(e){
        e.preventDefault();
        console.log("PRODUCT: " + (e))
        this.props.dispatch(selectProduct(e));
    }

    render() {
        if(this.props.products.success === true) {
            return (
                <div>
                    <br/>
                    {this.props.products.products.slice(1,50).map(function(row, item){
                        return (
                            <div>
                                <Col xs={6} md={2}>
                                        <Thumbnail alt="Serialized">
                                            <QRCode value={JSON.stringify(row)}/>
                                            <p><a href="/prodDetails" >{row._name}</a></p>
                                            <p>$ {row._price}</p>
                                            <br/>
                                            <p>
                                                <Button bsStyle="primary" >Info</Button>&nbsp;
                                                <Button bsStyle="default" onClick={index => ProductListSuccess.dispatch(selectProduct(row))} >BOM</Button>
                                            </p>
                                        </Thumbnail>
                                </Col>
                            </div>
                        );
                    })}
                </div>
            )
        }
        else if(this.props.products.success === false){
            return (
                <div>
                    <h1>Get Product Failed: {this.props.products.error}</h1>
                </div>
            )
        }
        return(
            <div>
            </div>
        )
    }
}
ProductListSuccess.propTypes = {
    products : React.PropTypes.object,
    handleSelectProduct: React.PropTypes.func
};
function mapStateToProps({products}) {
    return {
        products: products,

    }
}

export default connect(mapStateToProps)(ProductListSuccess);
