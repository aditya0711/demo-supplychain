/**
 * Created by adityaaggarwal on 1/4/17.
 */
import React,  {  Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Col, FormControl, FormGroup , ControlLabel} from 'react-bootstrap';
import { createProductAction } from '../actions/productActions';
import uuid from 'node-uuid';


class CreateProductForm extends Component {

    constructor(){
        super();
        this.handleCreateProduct = this.handleCreateProduct.bind(this);
    }
    componentDidMount(){
        this.productIdInput.value = uuid.v1();
        //console.log(JSON.stringify(this.props.products));
    }

    handleCreateProduct(e){
        e.preventDefault();
        var input = [];
        var product =
            {
                name                        : this.nameInput.value,
                price                       : this.priceInput.value,
                productId                   : uuid.v1()
            };

        input.push(product);
        this.props.dispatch(createProductAction(input));
        e.target.reset();
    }

    render() {
        var nameInput, price;
        var productIdInput;

        return(
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
        )
    }
}

function mapStateToProps({products}) {
    return {
        products: products
    }
}

export default connect(mapStateToProps)(CreateProductForm);
