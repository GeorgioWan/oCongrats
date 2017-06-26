import React, { Component } from 'react'
import { TextField } from 'react-md'

import { LotteryButton, BangList } from './'

class Lottery extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            quota: 1,
            bang: []
        };
    }
    /**
        Lottery
    **/
    getRandomArbitrary( size ) {
        let random = Math.floor( Math.random() * size ); 
        // 0: reactions, 1: comments, 2: shareds
        return random;
    }
    /** 
        Handle Event 
    **/
    handleChange(e){
        let value = e;
        value = value !== '' ? parseInt(value, 10) : 1;
        value = value > 0 ? value : 1;
        
        this.setState({ quota: value });
    }
    handleLottery( type ) {
        const { reactions, comments, shareds } = this.props;
        
        let { quota } = this.state;
        let id, bang = [];
        
        while ( quota > 0 ){
            switch(type){
                case 0:
                    if ( quota > reactions.length )
                        quota = reactions.length;
                    else {
                        id = this.getRandomArbitrary( reactions.length );
                        
                        if ( !bang.includes( reactions[id] ) ){
                            bang.push( reactions[id] );
                            quota--;
                        }
                    }
                    break;
                case 1:
                    if ( quota > comments.length )
                        quota = comments.length;
                    else {
                        id = this.getRandomArbitrary( comments.length );
                        
                        if ( !bang.includes( comments[id] ) ){
                            bang.push( comments[id] );
                            quota--;
                        }
                    }
                    break;
                case 2:
                    if ( quota > shareds.length )
                        quota = shareds.length;
                    else {
                        id = this.getRandomArbitrary( shareds.length );
                        
                        if ( !bang.includes( shareds[id] ) ){
                            bang.push( shareds[id] );
                            quota--;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        
        console.log(bang);
        this.setState({ bang });
    }
    render() {
        const { reactions, comments, shareds } = this.props;
        const { quota, bang } = this.state;
        
        return (
            <div id="rc-lottery">
                <div id="rc-quota">
                    <TextField id="quota"
                               label="抽獎名額"
                               type="number"
                               customSize="title"
                               lineDirection='center'
                               value={quota}
                               onChange={ this.handleChange.bind(this) }
                    />
                </div>
                <div>
                    <LotteryButton 
                        label="從「心情」抽獎囉！"
                        icon="fa fa-thumbs-o-up"
                        total={reactions.length}
                        quota={quota}
                        onClick={this.handleLottery.bind(this, 0)}
                    />
                    <LotteryButton 
                        label="從「留言」抽獎囉！"
                        icon="fa fa-comments-o"
                        total={comments.length}
                        quota={quota}
                        onClick={this.handleLottery.bind(this, 1)}
                    />
                    <LotteryButton 
                        label="從「分享」抽獎囉！"
                        icon="fa fa-share-square-o"
                        total={shareds.length}
                        quota={quota}
                        onClick={this.handleLottery.bind(this, 2)}
                    />
                </div>
                <BangList bang={bang}/>
            </div>
        );
    }
}

export default Lottery;
