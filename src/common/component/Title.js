import React from 'react';
import './common.css';
import logo from './logo.svg';


class Title extends React.Component {
    render() {
        return (
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to PirateCon</h2>
            </div>
        );
    }
}

export default Title;