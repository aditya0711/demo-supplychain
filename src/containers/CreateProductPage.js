/**
 * Created by adityaaggarwal on 24/2/17.
 */
import React, { PropTypes, Component } from 'react';

import CreateProductSuccess from '../components/CreateProductSuccess';
import CreateProductForm from '../components/CreateProductForm';

import { connect } from 'react-redux';
import '../styles/App.css';
import '../styles/common.css';

class CreateProductPage extends Component{

  constructor(){
    super();
    //this.handleCreateProduct = this.handleCreateProduct.bind(this);
  }
  componentDidMount(){
    console.log("CREATE PRODUCT PAGE: " + JSON.stringify(this.props.products));
  }

  render() {
    return (
        <div>
          <CreateProductSuccess/>
          <CreateProductForm/>
        </div>)
  }
}
const mapStateToProps = ({ products }) => ({
  products: products
});

CreateProductPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  products: PropTypes.object
};
export default connect(mapStateToProps)(CreateProductPage);
