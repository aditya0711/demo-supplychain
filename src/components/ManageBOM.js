/**
 * Created by adityaaggarwal on 1/5/17.
 */

import React, { PropTypes, Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ManageBOM = ({}) => {

    return(
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

export default ManageBOM;