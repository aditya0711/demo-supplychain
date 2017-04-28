/**
 * Created by adityaaggarwal on 28/4/17.
 */
import React, { PropTypes, Component } from 'react';
import QRCode from 'qrcode.react';
import {Panel, Row, Col, Thumbnail, Grid, Label, Button} from 'react-bootstrap'
import ProductDetailsHistoryTable from '../components/ProductDetailsHistoryTable';

const divStyle = {
    fontSize: '18pt',
    textAlign: 'left'
};

const p = {
    "address":"1002847ef7666fa964b74ae72a94ebe268ed1764",
    "_id":"ID_1993_90901914",
    "_name":"NAME_1993_90901914",
    "children":[
        {"id32":"0000000000000000000000000000000000000000000000000000000000000000",
            "adrs":"0000000000000000000000000000000000000000",
            "quantity":"0"}
            ],
    "_price":1234,
    "_id32":"0000000000000000000000000000000049445f313939335f3930393031393134"
};


class ProductDetailsComponent extends Component{

    constructor(){
        super();
        this.state = {product : p}
    }

    render(){
        return(
            <div>
            <Grid>
                <Row>
                    <Panel header="Product Details" bsStyle="success">
                        <Col xs={6} md={5}>
                            <QRCode value={JSON.stringify(this.state.product)} size={200} />
                        </Col>
                        <Col xs={6} md={3}>
                            <p style={divStyle}>{this.state.product._name}</p>
                            <h3><Label bsStyle="warning">Shipping</Label>&nbsp;<Label bsStyle="primary">Production</Label><Label bsStyle="success">Delivered</Label></h3>
                            <p style={divStyle} >$ {(this.state.product._price).toString().trim()}</p>
                            <p style={divStyle}>{this.state.product._id.toString().trim()}</p>
                            <p style={divStyle}>{this.state.product.address.toString().trim()}</p>
                        </Col>
                    </Panel>
                </Row>
                <Row>
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
        )}
}


ProductDetailsComponent.propTypes = {
    products : PropTypes.object,
    product : PropTypes.object,
    address: React.PropTypes.string,
    _name: React.PropTypes.string

};

export default ProductDetailsComponent;
