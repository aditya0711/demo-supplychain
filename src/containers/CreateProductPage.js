/**
 * Created by adityaaggarwal on 24/2/17.
 */
import React, { PropTypes, Component } from 'react';
import {
    createProductAction
} from '../actions/productActions';

import { connect } from 'react-redux';
import '../styles/App.css';
import '../styles/common.css';
import uuid from 'node-uuid';
import { Button, Form, Col, FormControl, FormGroup , ControlLabel, Checkbox} from 'react-bootstrap';


class CreateProductPage extends Component{

  constructor(){
    super();
    this.handleCreateProduct = this.handleCreateProduct.bind(this);
  }

  componentDidMount(){
    this.productIdInput.value = uuid.v1();
    console.log(JSON.stringify(this.props.products));
  }
    handleCreateProduct(e){
    e.preventDefault();
    var input = [];
    var product =
          {
          name                        : this.nameInput.value,
          description                 : this.descriptionInput.value,
          price                       : this.priceInput.value,
          manufacturingDateInput      : this.manufacturingDateInput.value,
          manufacturingLocationInput  : this.manufacturingLocationInput.value,
          productId                   : uuid.v1()
       };

    input.push(product);
    console.log("Product: " + JSON.stringify(input));
    this.props.dispatch(createProductAction(input));
    e.target.reset();

  }

  render() {
    // TODO: Render Add Product Page here
    const { products } = this.props;

    var nameInput, descriptionInput, manufacturingDateInput, manufacturingLocationInput, price;
    var productIdInput;
    console.log("Product ID" + JSON.stringify(productIdInput));
    return (<div>
        <div>
             <Form horizontal id="form1" onSubmit={this.handleCreateProduct}>

                  <center>
                  <h2 id="heading-form">Create Product</h2>
                  <hr id="hr1"/>
                  <br/>
                        <FormGroup controlId="id"  >
                            <Col componentClass={ControlLabel} sm={3}>
                                ID
                            </Col>
                            <Col sm={8}>
                                <FormControl disabled placeholder="Unique ID" inputRef={node => (this.productIdInput = node)} />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="name" >
                            <Col componentClass={ControlLabel} sm={3}>
                                Name
                            </Col>
                            <Col sm={8}>
                                <FormControl placeholder="Name"  inputRef={node => (this.nameInput = node)} />
                            </Col>
                        </FormGroup>

                      <FormGroup controlId="Price" >
                            <Col componentClass={ControlLabel} sm={3}>
                                Price
                            </Col>
                            <Col sm={8}>
                                <FormControl type="int" placeholder="Price"  inputRef={node => (this.priceInput = node)} />
                            </Col>
                        </FormGroup>
                        <Button bsStyle="success" type="submit">
                            Add Product
                        </Button>
                </center>
             </Form>
            <br/><br/>
            </div>
          </div>)
  }
}
const mapStateToProps = ({ products }) => ({
  products: products
});

CreateProductPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  products: PropTypes.array
};
export default connect(mapStateToProps)(CreateProductPage);
