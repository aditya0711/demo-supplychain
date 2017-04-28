/**
 * Created by adityaaggarwal on 28/4/17.
 */
import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import {Row, Col, Thumbnail, Grid, Label, Button} from 'react-bootstrap'
import ProductDetailsHistoryTable from '../components/ProductDetailsHistoryTable';

const divStyle = {
    fontSize: '18pt'
};

const ProductDetailsComponent = ({products}) => (
    <div>
        <Grid>
            <Row>
                <Col xs={6} md={5}>
                    <QRCode value="Product Name" size="200"/>
                </Col>
                <Col xs={6} md={3}>
                    <h2>Product ID</h2> <Label bsStyle="warning">Shipping</Label><Label bsStyle="primary">Production</Label><Label bsStyle="success">Delivered</Label>
                    <h2>Product Name</h2>
                    <h3>Product Price</h3>
                </Col>
            </Row>
            <Row>
                <br/><br/>
                <Col xs={6} md={1}>
                    <p style={divStyle}>History</p>
                </Col>
                <Col xs={6} md={4}>
                    <Button bsStyle="warning">Transfer Ownership</Button>
                </Col>

            </Row>
            <Row>
                <br/>
                <ProductDetailsHistoryTable/>
            </Row>
            <Row>
                <br/><br/>
                <Col xs={6} md={1}>
                    <p style={divStyle}>BOM</p>
                </Col>
                <Col xs={6} md={4}>
                    <Button bsStyle="info">Manage BOM</Button>
                </Col>
            </Row>
            <Row>
                <br/>
                <ProductDetailsHistoryTable/>
            </Row>
        </Grid>

    </div>
);

ProductDetailsComponent.propTypes = {
    products : PropTypes.object
};

export default ProductDetailsComponent;
