import React from 'react';
import Header from '../../common/component/Header';
import Title from '../../common/component/Title';
import Form from '../../AddProduct/component/Form';

class App extends React.Component {

    render() {
        return (
                <div className="App">
                    <Title/>
                    <Header headerProp = "Add Product"/>
                    <Form/>
                </div>
        )
    }
}

export default App;