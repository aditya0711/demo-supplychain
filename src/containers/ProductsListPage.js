/**
 * Created by Manish on 2/24/2017.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { getProductsList } from '../actions/productListActions';
import  ProductListComponent from '../components/ProductsListComponent';
import '../styles/style.css';


export class ProductsListPage extends Component {s
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.dispatch(getProductsList());
  }

  render() {
    return (
        <div>

          <ProductListComponent/>
        </div>
    );
  }
}

ProductsListPage.propTypes = {
  products : PropTypes.object
};

/* Subscribe component to  store and merge the state into component\s props */
const mapStateToProps = ({ products }) => ({
    products : products
});

/* connect method from react-router connects the component with redux store */
export default connect(mapStateToProps)(ProductsListPage);

