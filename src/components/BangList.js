import React, { Component } from 'react'

import { Bang } from './'

class BangList extends Component {
    render() {
        const { bang } = this.props;
        return (
            <div id="rc-bang-list" >
            {
                bang.length > 0 ?
                bang.map((b, index) => (
                    <Bang index={index} bang={b} />
                ))
                : ''
            }
            </div>
        );
    }
}

export default BangList;
