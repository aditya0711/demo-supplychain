/**
 * Created by adityaaggarwal on 31/3/17.
 */
import React,  {  Component } from 'react';
import { connect } from 'react-redux';

class CreateProductSuccess extends Component {

    render() {
        if(this.props.products.success === true) {
            return (
                <div>
                    <h1>PRODUCT ADDED SUCCESSFULLY</h1>
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

export default connect(mapStateToProps)(CreateProductSuccess);
