import '../styles/App.scss'

import React, { Component } from 'react'
import update from 'react/lib/update'

import { Button, TextField } from 'react-md'

import { Reactions, Comments, Shareds } from '../components'

class App extends Component {
    state = {
        auth: false,
        postID: '',
        reactions: [],
        comments: [],
        shareds: [],
        lottery: {
            quota: 1,
            bang: []
        },
        queried: {
            reactions: false,
            comments: false,
            shareds: false
        }
    }
    /** 
        Component Life Cycle 
    **/
    componentWillMount() {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/zh_TW/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    componentDidMount() {
        window.fbAsyncInit = function() {
            FB.init({
                appId: '131307714118201',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v2.9'
            });
            FB.AppEvents.logPageView();
            
            FB.getLoginStatus(function(response) {
                this.checkLoginState();
            }.bind(this));
        }.bind(this);
    }
    /** 
        FB - Check Status 
    **/
    statusChangeCallback(response, cb) {
        if (response.status === 'connected') { 
            console.log('== CONNECTED ==');
            this.setState({ auth: true });
            
            if ( cb )
                cb();
        }
        else if (response.status === 'not_authorized') {
            console.log('== NOT_AUTORIZED ==');
            alert('You need to authorize to sign in with facebook');
            this.setState({ auth: false });
        }
        else {
            console.log('== UNKNOWN ==');
            //alert('You need to authorize to sign in with facebook');
            this.setState({ auth: false });
        }
    }
    checkLoginState(cb) {
        FB.getLoginStatus((response) => {
            this.statusChangeCallback(response,cb);
        });
    }
    /** 
        FB - API fetch datas 
    **/
    fetchData( type, url, query = {} ){
        FB.api( url, 'GET', query, function(response) {
            console.log(type, response);
            let datas  = [],
                data   = response.data,
                paging = response.paging;
            
            if ( data )
                data.forEach((d) => {
                    datas.push( d );
                });
            
            if ( paging && paging.next )
                this.fetchData( type, paging.next );
            
            this.setState( update( this.state, { 
                [type]: { $push: datas },
                queried: {
                    [type]: { $set: true }
                }
            }));
        }.bind(this));
    }
    /**
        Parse Methods
    **/
    getPostID(postURL){
        postURL = postURL.split('/');
        
        if ( postURL.length <= 1 || !postURL.includes( 'www.facebook.com' ) )
            return;
            
        let pgID = postURL[3] === 'groups' ? 4 : 3;
        let type = pgID + 1;
        
        FB.api(`/${postURL[ pgID ]}`, 'GET', {}, function(response) {

            let pgID = response.id ;

            // Get Type of post and Get the post id in URL
            let postID = type + 1 ;
            type = postURL[ type ];
            
            if ( type === 'posts' || type === 'videos' || type === 'permalink' ){
                postID = postURL[ postID ];
            }
            else if ( type === 'photos' ){
                postID = postURL[ postID + 1  ];
            }
            
            this.setState({ postID: `${pgID}_${postID}` });
        }.bind(this));
    }
    /**
        Lottery
    **/
    getRandomArbitrary( size ) {
        let random = Math.floor( Math.random() * size ); // 0: reactions, 1: comments, 2: shareds

        return random;
    }
    /** 
        Handle Event 
    **/
    handleChange(e){
        let value = e;
        value = value !== '' ? parseInt(value, 10) : 1;
        value = value > 0 ? value : 1;
        
        this.setState(update( this.state, {
            lottery: {
                quota: { 
                    $set: value
                }
            }
        }));
    }
    handleURLChange(e){
        if ( e === '' ){
            this.setState({ postID: e });
            return;
        }
        
        this.getPostID(e);
    }
    handleFBLogin() {
        const { auth } = this.state;
        
        if ( auth === true ) {
            FB.logout((response) => {
                this.setState({ auth: false });
                console.log('Logged out.')
            });
        }
        else {
            FB.login((response) => {
                this.checkLoginState();
            }, {
                scope: 'public_profile'
            });
        }
    }
    handleFetchComments() {
        const { postID } = this.state;
        const 
            reactionsQuery = {
                'fields': 'name,pic_small,type',
                'filter': 'stream',
                'limit' : '5000'
            }, 
            commentsQuery = {
                'fields': 'attachment,from,message,like_count',
                'filter': 'stream',
                'limit' : '5000'
            },
            sharedpostsQuery = {
                'fields': 'from,message',
                'filter': 'stream',
                'limit' : '5000'
            };
        
        this.fetchData( 'reactions', `/${postID}/reactions`, reactionsQuery );
        this.fetchData( 'comments', `/${postID}/comments`, commentsQuery );
        this.fetchData( 'shareds', `/${postID}/sharedposts`, sharedpostsQuery );
    }
    handleLottery( type ) {
        const { reactions, comments, shareds, lottery } = this.state;
        let id,
            bang = [],
            quota = lottery.quota;
        
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
        this.setState( update( this.state, {
            lottery: {
                bang: { $merge: bang }
            }
        }));
    }
    render() {
        const { auth, postID, reactions, comments, shareds, lottery, queried } = this.state;
        
        return (
            <div id="rc-main" >
                <div>
                    <h1>OH！開獎囉！</h1>
                </div>
                {
                    auth === true ?
                    <div>
                        {
                            queried.reactions === true && 
                            queried.comments  === true &&
                            queried.shareds   === true ?
                            <div id="rc-lottery">
                                <div id="rc-quota">
                                    <TextField id="quota"
                                               label="抽獎名額"
                                               type="number"
                                               value={lottery.quota}
                                               onChange={ this.handleChange.bind(this) }
                                    />
                                </div>
                                <div>
                                    <span>
                                        <div>從 {reactions.length} 人中抽 {lottery.quota} 位</div>
                                        <Button raised secondary
                                                label="從「心情」抽獎囉！"
                                                iconClassName="fa fa-thumbs-o-up"
                                                onClick={this.handleLottery.bind(this, 0)}></Button>
                                    </span>
                                    <span>
                                        <div>從 {comments.length} 人中抽 {lottery.quota} 位</div>
                                        <Button raised secondary
                                                label="從「留言」抽獎囉！"
                                                iconClassName="fa fa-comments-o"
                                                onClick={this.handleLottery.bind(this, 1)}></Button>
                                    </span>  
                                    <span>
                                        <div>從 {shareds.length} 人中抽 {lottery.quota} 位</div>
                                        <Button raised secondary
                                                label="從「分享」抽獎囉！"
                                                iconClassName="fa fa-share-square-o"
                                                onClick={this.handleLottery.bind(this, 2)}></Button>
                                    </span>
                                </div>
                            </div>
                            :
                            <div>
                                <div id="rc-post-url">
                                    <TextField id="post-url"
                                               label="貼文連結"
                                               placeholder="https://www.facebook.com/example/948794879487"
                                               required
                                               onChange={ this.handleURLChange.bind(this) }
                                    />
                                </div>
                                <Button raised secondary
                                    label="幫你抓一把"
                                    disabled={ postID === '' ? true : false } 
                                    onClick={this.handleFetchComments.bind(this)}></Button>
                                <div className="rc-info-group">
                                    <div className="rc-info"><b>留言‧按讚‧心情‧分享</b></div>
                                    <div className="rc-info">能撈就撈，能抓就抓，抓好抓滿。</div>
                                </div>
                            </div>
                        }
                    </div> 
                    :
                    <div>
                        <Button raised primary
                            id='rc-login'
                            label='Login'
                            iconClassName="fa fa-facebook-official"
                            onClick={this.handleFBLogin.bind(this)}></Button>
                        <div className="rc-info-group">
                            <div className="rc-info">請先登入以便抓取 Facebook 資訊，此將只會提供您 <b>已公開的資訊</b></div>
                            <div className="rc-info">且我們並不會作任何存取動作，更不會利用及散布您的資訊，請安心服用。</div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default App;
