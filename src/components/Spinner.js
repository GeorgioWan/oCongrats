import React, { Component } from 'react'
import { SPINNER } from '../img'

class Spinner extends Component {
    render(){
        return (
            <div id="rc-spinner">
                <img src={SPINNER}/>
            </div>
        );
    }
}

export default Spinner;