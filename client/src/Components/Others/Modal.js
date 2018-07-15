import React, { Component } from 'react';
import '../../App.css';

class Modal extends Component{
    render(){
        return(
            <div className={this.props.show_modal ? 'loader show': 'loader'}>
                <div>
                    <p>Analizando Foto.</p>
                </div>
            </div>
        )
    }
}

export default Modal;