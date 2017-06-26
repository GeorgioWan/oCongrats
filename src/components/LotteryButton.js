import React, { Component } from 'react'
import { Button } from 'react-md'

class LotteryButton extends Component {
    handleClick(){
        const { onClick } = this.props;
        
        if ( onClick )
            onClick();
    }
    render() {
        const { 
            label,
            icon,
            total, 
            quota 
        } = this.props;
        
        return (
            <span className="rc-lottery-btn">
                {
                    quota <= total ?
                    <div className="rc-lottery-btn-info">
                        {
                            screen.width > 768 ?
                            `從 ${total} 人中抽 ${quota} 位`
                            :
                            `${quota}/${total}`
                        }
                    </div>
                    :
                    <div className="rc-lottery-btn-info rc-lottery-btn-info-warn">
                    {
                        screen.width > 768 ?
                        `人數不滿 ${quota} 位喔！(共 ${total} 人)`
                        :
                        `${quota}/${total}人數不足`
                    }
                    </div>
                }
                <Button raised secondary
                        label={ screen.width > 768 ? label : ''}
                        iconClassName={icon}
                        disabled={ total === 0 }
                        onClick={this.handleClick.bind(this)}></Button>
            </span>
        );
    }
}

export default LotteryButton;
