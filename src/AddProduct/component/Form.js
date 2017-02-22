import React from 'react';

class Form extends React.Component {
    render() {
        return (
            <div className="App-intro">
                <br /><br />
                <p/><p/>
                <div id="content">
                    <form id="form1">
                        <label>Product ID :</label><br /><input disabled="true" type="text" id="id" value={this.props.id} onChange={this.handleChange} /><br/><br/>
                        <label>Product Name :</label><br /><input type="text" id="name" value={this.props.name} onChange={this.handleChange} /><br/><br/>
                        <label>Product Description :</label><br /><input type="text" id="description" value={this.props.description}  onChange={this.handleChange} /><br/><br/>
                        <label>Manufacturing Date :</label><br /><input type="date" id="date" value={this.props.date} onChange={this.handleChange} /><br/><br/>
                        <label>Manufacturing Location :</label><br /><input type="text" id="location" value={this.props.location} onChange={this.handleChange} /><br/><br/>
                        <center>
                            <button href="./ProductList" type="submit" id="btn1">
                                Add Product
                            </button>
                        </center>
                    </form>
                    <br /><br />
                </div>
            </div>
        );
    }
}

export default Form;