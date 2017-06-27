import React, { Component } from 'react'
import { Paper } from 'react-md'

import { 
    COMMENT,
    SHARE,
    LIKE,
    LOVE,
    HAHA,
    SAD,
    WOW,
    ANGRY
} from '../img/'

const reactions = {
    url: {
        LIKE,
        LOVE,
        HAHA,
        SAD,
        WOW,
        ANGRY
    },
    words: {
        LIKE: '讚',
        LOVE: '大心',
        HAHA: '哈',
        SAD: '嗚',
        WOW: '哇',
        ANGRY: '怒'
    }
}

class Bang extends Component {
    timeFormat(t){
        // Some problame on mobile...
        let time = new Date(t);
        
        return `${time.getFullYear()}年${time.getMonth()}月${time.getDate()}日`;
    }
    bangCard(){
        const { bang } = this.props;
        const type = bang.queryType;
        let id, bg_url, avatar, username, created_time, message;

        if ( type === 'reactions' ){
            id = bang.id,
            bg_url = reactions.url[bang.type],
            avatar = bang.pic_square,
            username = bang.name,
            message = <span>對您的貼文表示 <b>{reactions.words[bang.type]}</b></span>;
        }
        else if ( type === 'comments' || type === 'shareds' ){
            id = bang.from.id,
            bg_url = type === 'comments' ? COMMENT : SHARE,
            avatar = bang.from.picture.data.url,
            username = bang.from.name,
            created_time = this.timeFormat(bang.created_time),
            message = bang.message !== '' ? 
                        (
                            (bang.message && bang.message.length > 20) ?
                            `${bang.message.substring(0,20)}...` : bang.message
                        )
                        :
                        <img src={  bang.attachment.target.url } />;
        }
        
        username = username.length > 20 ?
                    `${username.substring(0,20)}...` : username;
        
        
        return (
            <a href={ `https://www.facebook.com/${id}` } target='_blank'>
                <div className="rc-bang-bg" style={{ backgroundImage: `url(${ bg_url })` }}>
                    <div className="rc-bang">
                        <div className='rc-bang-info'>
                            <img className="avatar" src={avatar}/>
                            {
                                created_time ?
                                <div className='rc-bang-created-time'>{created_time}</div>
                                : ''
                            }
                            <div className='rc-bang-username'>{username}</div>
                            <div className='rc-bang-actions'>{message}</div>
                        </div>
                    </div>
                </div>
            </a>
        );
    }
    render() {
        const bangCard = this.bangCard();
        
        return (
            <Paper 
                className={ `rc-bang-paper bounceIn` }
                zDepth={1}>
            { bangCard }
            </Paper>
        );
    }
}

export default Bang;
