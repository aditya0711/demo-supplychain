/**
 * Created by adityaaggarwal on 31/3/17.
 */
import React,  {  Component } from 'react';
import { connect } from 'react-redux';

class CreateProductSuccess extends Component {

    componentDidMount() {
        console.log("CREATE PRODUCT SUCCESS COMPONENT PROPS: " + JSON.stringify(this.props));
    }
    componentWillUpdate(){
        console.log("COMPONENT UPDATE" + JSON.stringify(this.props));
    }

    render() {
        if(this.props.products.success === 'true') {
            return (
                <div>
                    <h1>PRODUCT ADDED SUCCESSFULLY</h1>
                </div>
            )
        }
        return(
            <div>
                <h1>SOMETHING</h1>
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
