import '../styles/App.scss'

import React, { Component } from 'react'
import update from 'react/lib/update'

import { Button, TextField } from 'react-md'

import { 
    Login,
    Lottery,
    FetchPost,
    
    Reactions, 
    Comments, 
    Shareds 
} from '../components'

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
            //console.log('== CONNECTED ==');
            this.setState({ auth: true });
            
            if ( cb )
                cb();
        }
        else if (response.status === 'not_authorized') {
            //console.log('== NOT_AUTORIZED ==');
            alert('You need to authorize to sign in with facebook');
            this.setState({ auth: false });
        }
        else {
            //console.log('== UNKNOWN ==');
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
        Handle Event 
    **/
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
    handleFetchDatas( postID ) {
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
    render() {
        const { auth, reactions, comments, shareds, queried } = this.state;
        const queriedDone = queried.reactions === true && 
                            queried.comments  === true &&
                            queried.shareds   === true ;
        
        return (
            <div id="rc-main" >
                <div className="slideInUp">
                    <h1>OH！開獎囉！</h1>
                </div>
                {
                    auth === true ?
                    <div>
                        {
                            queriedDone ?
                            <Lottery 
                                reactions={reactions}
                                comments={comments}
                                shareds={shareds}
                            />
                            :
                            <FetchPost onClick={this.handleFetchDatas.bind(this)}/>
                        }
                    </div> 
                    :
                    <Login onClick={this.handleFBLogin.bind(this)}/>
                }
            </div>
        );
    }
}

export default App;
