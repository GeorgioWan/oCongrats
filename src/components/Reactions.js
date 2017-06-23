import React, { Component } from 'react'

class Reactions extends Component {
    render() {
        const { reactions } = this.props;
        
        return (
            <div>
            {
                reactions.length !== 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>誰誰誰</th>
                            <th>表示</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        reactions.map((r, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={ r.pic_small } />
                                    <a href={ `https://www.facebook.com/${r.id}` } target="_blank">{r.name}</a>
                                </td>
                                <td>{ r.type }</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                : 'no reactions'
            }
            </div>
        );
    }
}

export default Reactions;
