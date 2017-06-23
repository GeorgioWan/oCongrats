import React, { Component } from 'react'

class Shareds extends Component {
    render() {
        const { shareds } = this.props;
        
        return (
            <div>
            {
                shareds.length !== 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>誰誰誰分享</th>
                            <th>說什麼</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        shareds.map((s, index) => (
                            <tr key={index}>
                                <td>
                                    <a href={ `https://www.facebook.com/${s.from.id}` } target="_blank">{s.from.name}</a>
                                </td>
                                <td>
                                    <a href={ `https://www.facebook.com/${s.id}` } target="_blank">{s.message}</a>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                : 'no shareds'
            }
            </div>
        );
    }
}

export default Shareds;
