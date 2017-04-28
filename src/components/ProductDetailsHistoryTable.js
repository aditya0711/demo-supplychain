/**
 * Created by adityaaggarwal on 28/4/17.
 */

import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import {Row, Col, Thumbnail, Grid, Label, Table} from 'react-bootstrap'

var history = [
    {}
]

const ProductDetailsHistoryTable = ({products}) => (
    <div>
        <Table responsive bordered>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Step</th>
                    <th>Owner</th>
                    <th>Date Received</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Table cell</td>
                    <td>Table cell</td>
                    <td>Table cell</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Table cell</td>
                    <td>Table cell</td>
                    <td>Table cell</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Table cell</td>
                    <td>Table cell</td>
                    <td>Table cell</td>
                </tr>
            </tbody>
        </Table>
    </div>
);

ProductDetailsHistoryTable.propTypes = {
    products : PropTypes.object
};

export default ProductDetailsHistoryTable;
