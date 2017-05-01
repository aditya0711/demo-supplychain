/**
 * Created by adityaaggarwal on 28/4/17.
 */

import React, { PropTypes } from 'react';
import QRCode from 'qrcode.react';
import {Row, Col, Thumbnail, Grid, Label, Table} from 'react-bootstrap'


const BOMTable = ({info}) => (
    <div>
        <Table responsive bordered>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Quantity</th>
                    <th>Product ID</th>
                </tr>
            </thead>
            <tbody>
            {info.map(function(item, iterator){
                return (
                    <tr>
                        <td>{iterator + 1}</td>
                        <td>{item.id32}</td>
                        <td>{item.adrs}</td>
                        <td>{item.quantity}</td>
                    </tr>
                )
            }, this)
            }
            </tbody>
        </Table>
    </div>
);

BOMTable.propTypes = {
    products : PropTypes.object,
    info : PropTypes.array,
    id32 : PropTypes.string,
    adrs : PropTypes.string,
    quantity: PropTypes.string,
    item : PropTypes.object
};
BOMTable.defaultProps = {
    info : [{ id32: 'abcdefgh192837465', adrs: 'abcdefgh192837465', quantity: '123' }],
    item : { id32: 'abcdefgh192837465', adrs: 'abcdefgh192837465', quantity: '123' },
    iterator: 1
}

export default BOMTable;
