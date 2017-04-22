/**
 * Created by adityaaggarwal on 22/4/17.
 */

import React,  {  Component } from 'react';
import { connect } from 'react-redux';

class ProductListSuccess extends Component {

    render() {
        if(this.props.products.success === true) {
            return (
                <div>
                    <h5>{JSON.stringify(this.props.products.products).toString()}</h5>
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

function mapStateToProps({products}) {
    return {
        products: products
    }
}

export default connect(mapStateToProps)(ProductListSuccess);
