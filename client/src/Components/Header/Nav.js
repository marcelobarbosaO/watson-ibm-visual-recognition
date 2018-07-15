import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import '../../App.css';

class Nav extends Component{
    render() {
        return (            
            <Navbar className="nav cyan" brand='Upload de Foto Watson'/>
        );
    }
}

export default Nav;