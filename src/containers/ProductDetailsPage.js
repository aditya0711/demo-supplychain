/**
 * Created by adityaaggarwal on 28/4/17.
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { getProductsList } from '../actions/productListActions';
import  ProductDetailsComponent from '../components/ProductDetailsComponent';
import '../styles/style.css';

export class ProductDetailsPage extends Component {s
    constructor() {
        super();
        this.state = { product: {}};
    }

    componentDidMount() {
        this.props.dispatch(getProductsList());
    }

    render() {
        return (
            <div>
                <ProductDetailsComponent id={this.props.products.products[1]}/>
            </div>
    );
    }
}

ProductDetailsPage.propTypes = {
    products : PropTypes.object
};

/* Subscribe component to  store and merge the state into component\s props */
const mapStateToProps = ({ products }) => ({
    products : products
});

/* connect method from react-router connects the component with redux store */
export default connect(mapStateToProps)(ProductDetailsPage);


