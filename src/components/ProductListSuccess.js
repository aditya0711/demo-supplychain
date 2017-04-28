/**
 * Created by adityaaggarwal on 22/4/17.
 */

import React,  {  Component } from 'react';
import { connect } from 'react-redux';
import {Checkbox, Col, Thumbnail, Form, Label, Button} from 'react-bootstrap'
import QRCode from 'qrcode.react';
import { selectProduct } from '../actions/productListActions';

const divStyle = {
    fontSize: '18pt'
};
class ProductListSuccess extends Component {

    constructor(){
        super();
        this.handleSelectProduct = this.handleSelectProduct.bind(this);
    }

    handleSelectProduct(row, e){
        e.preventDefault();
        console.log("PRODUCT: " + JSON.stringify(row))
        this.props.dispatch(selectProduct(row));
        window.location.assign('/prodDetails');
    }


    render() {
        var selectedProduct;
        if(this.props.products.success === true) {
            return (
                <div>
                    {this.props.products.products.slice(1,50).map(function(row, item){
                        return (
                            <div>
                                <Col xs={6} md={4}>
                                        <Thumbnail alt="Serialized">
                                            <p style={divStyle}> {row._name}</p>
                                            <p>$ {row._price}</p>
                                            <br/>
                                            <p><Button bsStyle="warning" >BOM</Button>&nbsp;
                                            <Button bsStyle="success" onClick={e => this.handleSelectProduct(row, e)} >Info</Button></p>
                                        </Thumbnail>
                                </Col>
                            </div>
                        );
                    }, this)}
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
    products : React.PropTypes.object
};
function mapStateToProps({products}) {
    return {
        products: products,

    }
}

export default connect(mapStateToProps)(ProductListSuccess);
