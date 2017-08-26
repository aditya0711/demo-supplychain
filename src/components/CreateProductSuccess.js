/**
 * Created by adityaaggarwal on 31/3/17.
 */
import React,  {  Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

class CreateProductSuccess extends Component {

    constructor(){
        super();
        this.state ={ showModal: true }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }
    componentDidMount(){
        //this.setState({ showModal: false });
    }

    close() {
        this.setState({ showModal: false });
        window.location.reload();
    }

    open() {
        this.setState({ showModal: true });
    }

    render() {
        if(this.props.products.success === true) {
            return (
                <div>
                    <Modal show={this.state.showModal} onHide={this.close}>
                            <Modal.Header closeButton>
                                <Modal.Title>Product Creation</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                Product Successfully Created
                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={this.close}> Close</Button>
                            </Modal.Footer>
                    </Modal>
                </div>
            )
        }
        else if(this.props.products.success === false){
            return (
                <div>
                            <Modal show={this.state.showModal} onHide={this.close}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Error: Product Creation</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    Error while creating Product: {this.props.products.error}
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button onClick={this.close}> Close</Button>
                                </Modal.Footer>
                            </Modal>
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
