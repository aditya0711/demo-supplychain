// /**
//  * Created by adityaaggarwal on 15/2/17.
//  */
// import React, {Component} from "react";
// import "./App_card.css";
// import logo from './logo.svg';
//
//
// import {Table, Column, Cell} from "fixed-data-table";
//
//
// const rows = [
//     ['a1', 'b1', 'c1'],
//     ['a2', 'b2', 'c2'],
//     ['a3', 'b3', 'c3'],
//     // .... and more
// ];
//
// class ProductsList extends Component{
//     constructor(props){
//         super(props);
//         this.state = {};
//         console.log('loaded');
//
//
//         var NavBar = React.createClass({
//             getInitialState: function(){
//                 return { focused: 0 };
//             },
//
//             clicked: function(index){
//                 this.setState({focused: index});
//             },
//
//             render: function() {
//                 var self = this;
//
//                 //use MAP to create LI elements from our navItems properties
//                 var navElements = this.props.navItems.map(function(title, index){
//
//                     var style = '';
//
//                     if(self.state.focused == index){
//                         style = 'active'
//                     }
//
//                     var navItem = <li className={style} onClick={self.clicked.bind(self, index)}><a href="#">{ title }</a></li>
//                     return navItem;
//                 });
//
//                 //draw our 'navElements' inside the ul
//                 return (
//                     <ul className="nav navbar-nav">
//                         { navElements }
//                     </ul>
//
//                 );
//             }
//         });
//
//         ReactDOM.render(<NavBar navItems={[ 'Home', 'About', 'Contact' ]} />, document.getElementById('nav'));
//
//         var SubNavBar = React.createClass({
//             render: function() {
//
//                 //use MAP to create LI elements from our navItems properties
//                 var subNavElements = this.props.subNavItems.map(function(title){
//                     var subNavItem = <li><a href="#">{ title }</a></li>
//                     return subNavItem;
//                 });
//
//                 //draw our 'navElements' inside the ul
//                 return (
//                     <ul className="nav navbar-nav">
//                         { subNavElements }
//                     </ul>
//
//                 );
//             }
//         });
//         ReactDOM.render(<SubNavBar subNavItems={[ 'Blog', 'Careers', 'Contact' ]} />, document.getElementById('nav-footer'));
//
//
// //BODY CONTENT
//         var HiThere = React.createClass ({
//             render: function() {
//                 return (<h1>Hello World</h1>);
//             }
//         });
//         ReactDOM.render(<HiThere />, document.getElementById('app'));
//
// //CARD
//         var CardContainer = React.createClass({
//             render: function(){
//                 var cards = [];
//                 for(var i = 1; i <= this.props.numCards; i += 1){
//                     cards.push(<CardItem idNum={i}  />);
//                 }
//                 return (
//                     <div className="card-flex">{cards}</div>
//                 );
//             }
//         });
//
//         var CardItem = React.createClass({
//             render: function() {
//                 return(
//                     <div id={'card-' + this.props.idNum} className="card-flex-item"></div>
//                 );
//             }
//         });
//
//         var CardContent = React.createClass({
//             render: function(){
//                 return(
//                     <div className="card-flex-wrapper">
//                         <div className="card-flex-image">
//                             <img src={this.props.imgSrc} alt="img placeholder" />
//                         </div>
//                         <div className="card-flex-content">
//                             <h3>{this.props.headerText}</h3>
//                             <p>{this.props.description}</p>
//                             <a href={this.props.url} className="card-flex-button btn-block">Button</a>
//                         </div>
//                     </div>
//                 );
//             }
//         });
//
// //Change number of cards 1-10
//         ReactDOM.render(<CardContainer numCards={5} />, document.getElementById('card'));
//
// //Card content here
//         ReactDOM.render(<CardContent
//             imgSrc="https://placeimg.com/640/480/nature"
//             headerText="One"
//             description="I'm a card and I'm first"
//             url="https://chriswrightdesign.com/experiments/using-flexbox-today/#card-layout" />, document.getElementById('card-1'));
//         ReactDOM.render(<CardContent
//             imgSrc="http://lorempixel.com/640/480/abstract/"
//             headerText="Two"
//             description="I'm a card and I'm Second"
//             url="https://chriswrightdesign.com/experiments/using-flexbox-today/#card-layout" />, document.getElementById('card-2'));
//         ReactDOM.render(<CardContent
//             imgSrc="http://lorempixel.com/640/480/city/"
//             headerText="Three"
//             description="I'm a card and I'm Third"
//             url="https://chriswrightdesign.com/experiments/using-flexbox-today/#card-layout" />, document.getElementById('card-3'));
//         ReactDOM.render(<CardContent
//             imgSrc="http://lorempixel.com/640/480/people/"
//             headerText="Four"
//             description="I'm a card and I'm Four"
//             url="https://chriswrightdesign.com/experiments/using-flexbox-today/#card-layout" />, document.getElementById('card-4'));
//         ReactDOM.render(<CardContent
//             imgSrc="http://lorempixel.com/640/480/food/"
//             headerText="Five"
//             description="I'm a card and I'm Five"
//             url="https://chriswrightdesign.com/experiments/using-flexbox-today/#card-layout" />, document.getElementById('card-5'));
//     }
//     render() {
//         return(
//             <div className="App">
//                 <div className="App-header">
//                     <img src={logo} className="App-logo" alt="logo" />
//                     <h2>Welcome to PirateCon</h2>
//                 </div>
//
//                 <nav class="navbar navbar-default navbar-fixed-top">
//                     <div class="container">
//                         <div class="navbar-header">
//                             <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
//                                 <span class="sr-only">Toggle navigation</span>
//                                 <span class="icon-bar"></span>
//                                 <span class="icon-bar"></span>
//                                 <span class="icon-bar"></span>
//                             </button>
//                             <a class="navbar-brand" href="#">Card Layout by Vanss472</a>
//                         </div>
//
//                         <div id="navbar" class="collapse navbar-collapse">
//
//                             <div id="nav"></div>
//                         </div>
//
//                     </div>
//                 </nav>
//
//                 <div class="content container">
//                     <div class="page-header">
//                         <div id="app"></div>
//                     </div>
//                     <div id="card"></div>
//                 </div>
//
//
// </div>
//         );
//
//     }
// }
//
// export default  ProductsList;