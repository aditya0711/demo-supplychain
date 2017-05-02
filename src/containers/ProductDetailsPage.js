/**
 * Created by adityaaggarwal on 28/4/17.
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { getProductsList } from '../actions/productListActions';
import  ProductDetailsComponent from '../components/ProductDetailsComponent';
import '../styles/style.css';

const p = {
    "address":"1002847ef7666fa964b74ae72a94ebe268ed1764",
    "_id":"ID_1993_90901914",
    "_name":"NAME_1993_90901914",
    "children":[
        {   "id32":"0000000000000000000000000000000000000000000000000000000000000000",
            "adrs":"0000000000000000000000000000000000000000",
            "quantity":"0"}
    ],
    "_price":1234,
    "_id32":"0000000000000000000000000000000049445f313939335f3930393031393134"
};


export class ProductDetailsPage extends Component {
    constructor() {
        super();
        console.log("CADASDASDASDSADAS: " + JSON.stringify(this.props.products))
        this.state = { product: this.props.products , showModal: false};
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    componentDidMount() {
        //this.props.dispatch(getProductsList());

    }

    render() {
        return (
            <div>
                <ProductDetailsComponent product={p} context={this}/>
            </div>
    );
    }
}

ProductDetailsPage.propTypes = {
    products : PropTypes.object,
    product : PropTypes.object
};

/* Subscribe component to  store and merge the state into component\s props */
const mapStateToProps = ({ products }) => ({
    products : products
});

/* connect method from react-router connects the component with redux store */
export default connect(mapStateToProps)(ProductDetailsPage);


