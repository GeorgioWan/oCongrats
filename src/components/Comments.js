import React, { Component } from 'react'

class Comments extends Component {
    render() {
        const { comments } = this.props;
        
        return (
            <div>
            {
                comments.length !== 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>誰誰誰</th>
                            <th>說什麼</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        comments.map((c, index) => (
                            <tr key={index}>
                                <td>
                                    <a href={ `https://www.facebook.com/${c.from.id}` } target="_blank">{c.from.name}</a>
                                </td>
                                <td>
                                    { 
                                        c.message !== '' ? 
                                        <p>{c.message}</p> :
                                        <img src={  c.attachment.target.url } />
                                    }
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                : 'no comments'
            }
            </div>
        );
    }
}

export default Comments;
