/**
 * Created by adityaaggarwal on 28/4/17.
 */
import React, { PropTypes, Component } from 'react';
import QRCode from 'qrcode.react';
import {Panel, Row, Col, ButtonGroup, Grid, Label, Button, Modal, DropdownButton, MenuItem} from 'react-bootstrap'
import ProductDetailsHistoryTable from '../components/ProductDetailsHistoryTable';
import BOMTable from '../components/BOMTable';
import ManageBOM from '../components/ManageBOM';

const divStyle = {
    fontSize: '18pt',
    textAlign: 'left'
};

const p = {
    "address":"1002847ef7666fa964b74ae72a94ebe268ed1764",
    "_id":"ID_1993_90901914",
    "_name":"NAME_1993_90901914",
    "children":[
        {
            "id32":"0000000000000000000000000000000000000000000000000000000000000000",
            "adrs":"0000000000000000000000000000000000000000",
            "quantity":"0"
        }
        ],
    "_price":1234,
    "_id32":"0000000000000000000000000000000049445f313939335f3930393031393134"
};

const ProductDetailsComponent = ({context, product}) =>{
    return(
        <div>
            <Grid>
                <Row>
                    <Panel header="Product Details" bsStyle="success">
                        <Col xs={6} md={5}>
                            <QRCode value={JSON.stringify(product)} size={200} />
                        </Col>
                        <Col xs={6} md={3}>
                            <p style={divStyle}>{product._name}</p>
                            <h3><Label bsStyle="warning">Shipping</Label>&nbsp;<Label bsStyle="primary">Production</Label>&nbsp;<Label bsStyle="success">Delivered</Label></h3>
                            <p style={divStyle} >$ {(product._price).toString().trim()}</p>
                            <p style={divStyle}>{product._id.toString().trim()}</p>
                            <p style={divStyle}>{product.address.toString().trim()}</p>
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
                        <Button bsStyle="info" onClick = {context.open}>Manage BOM</Button>
                    </Col>
                </Row>
                <Row>
                    <br/>
                    <BOMTable info={p.children}/>
                    <div>
                        <Modal show={context.state.showModal} onHide={context.close}>
                            <Modal.Header closeButton>
                                <Modal.Title>Manage Bill of Materials - Link Child Products</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <ButtonGroup>

                                    <DropdownButton title="Select a Sub Product" id="dropdown-size-medium">
                                        <MenuItem eventKey="1">Action</MenuItem>
                                        <MenuItem eventKey="2">Another action</MenuItem>
                                        <MenuItem eventKey="3" active>Active Item</MenuItem>
                                        <MenuItem divider />
                                        <MenuItem eventKey="4">Separated link</MenuItem>
                                    </DropdownButton>
                                    <Button bsStyle="primary">LINK</Button>
                                </ButtonGroup>
                                <br/><br/><br/>
                                <BOMTable/>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={context.close}> Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </Row>
            </Grid>

        </div>
    )
}
// class ProductDetailsComponent extends Component{
//
//     constructor(){
//         super();
//         this.state = {product : p}
//     }
//
//     render(){
//         return(
//             <div>
//             <Grid>
//                 <Row>
//                     <Panel header="Product Details" bsStyle="success">
//                         <Col xs={6} md={5}>
//                             <QRCode value={JSON.stringify(this.state.product)} size={200} />
//                         </Col>
//                         <Col xs={6} md={3}>
//                             <p style={divStyle}>{this.state.product._name}</p>
//                             <h3><Label bsStyle="warning">Shipping</Label>&nbsp;<Label bsStyle="primary">Production</Label><Label bsStyle="success">Delivered</Label></h3>
//                             <p style={divStyle} >$ {(this.state.product._price).toString().trim()}</p>
//                             <p style={divStyle}>{this.state.product._id.toString().trim()}</p>
//                             <p style={divStyle}>{this.state.product.address.toString().trim()}</p>
//                         </Col>
//                     </Panel>
//                 </Row>
//                 <Row>
//                 </Row>
//                     <Row>
//                             <br/><br/>
//                             <Col xs={6} md={1}>
//                                 <p style={divStyle}>History</p>
//                             </Col>
//                             <Col xs={6} md={4}>
//                                 <Button bsStyle="warning">Transfer Ownership</Button>
//                             </Col>
//
//                     </Row>
//                     <Row>
//                         <br/>
//                         <ProductDetailsHistoryTable/>
//                     </Row>
//                 <Row>
//                     <br/><br/>
//                     <Col xs={6} md={1}>
//                         <p style={divStyle}>BOM</p>
//                     </Col>
//                     <Col xs={6} md={4}>
//                         <Button bsStyle="info">Manage BOM</Button>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <br/>
//                     <ProductDetailsHistoryTable/>
//                 </Row>
//             </Grid>
//
//         </div>
//         )}
// }


ProductDetailsComponent.propTypes = {
    products : PropTypes.object,
    product : PropTypes.object,
    address: React.PropTypes.string,
    _name: React.PropTypes.string,
    _id: React.PropTypes.string,
    _price: React.PropTypes.string,

};

ProductDetailsComponent.defaultProps = {
    product : { _id: '1234', _name: 'Aditya', _price:711, address: 'abcdefgh1192837465' }
}

export default ProductDetailsComponent;
