import React, { Component } from 'react'
import { TextField } from 'react-md'

import { Button } from 'react-md'

import { LotteryButton, BangList, Spinner } from './'

class Lottery extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            quota: 1,
            bang: [],
            loading: false
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
        
        
        this.setState({ 
            bang,
            loading: true
        });
        
        setTimeout(()=>{
            this.setState({ 
                loading: false
            });
        }, 2000);
    }
    handleMinus(){
        let { quota } = this.state;
        
        this.setState({ quota: quota - 1 });
    }
    handlePlus(){
        let { quota } = this.state;
        
        this.setState({ quota: quota + 1 });
    }
    render() {
        const { reactions, comments, shareds } = this.props;
        const { quota, bang, loading } = this.state;
        
        return (
            <div id="rc-lottery">
                <div id="rc-quota">
                    <Button 
                        icon 
                        primary
                        disabled={ quota === 1 }
                        iconClassName='fa fa-minus' 
                        onClick={this.handleMinus.bind(this)}></Button>
                    <div className="quota">
                        <TextField id="quota"
                                   label="抽獎名額"
                                   type="number"
                                   customSize="title"
                                   lineDirection='center'
                                   value={quota}
                                   onChange={ this.handleChange.bind(this) }
                        />
                    </div>
                    <Button 
                        icon 
                        primary
                        iconClassName='fa fa-plus' 
                        onClick={this.handlePlus.bind(this)}></Button>
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
                {
                    loading ?
                    <Spinner />
                    :
                    <BangList bang={bang}/>
                }
            </div>
        );
    }
}

export default Lottery;
