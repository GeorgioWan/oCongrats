import '../styles/App.scss'

import React, { Component } from 'react'
import update from 'react/lib/update'

import * as firebase from 'firebase'

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
        user:{},
        access_token:'',
        reactions: [],
        comments: [],
        shareds: [],
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
            if ( cb )
                cb();
        }
        else if (response.status === 'not_authorized') {
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
        const { access_token } = this.state;
        
        FB.api( url, 'GET', {access_token, ...query},function(response) {
            console.log(type, response);
            let datas  = [],
                data   = response.data,
                paging = response.paging;
            
            if ( data )
                data.forEach((d) => {
                    d.queryType = type;
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
        
        if ( !auth ) {
            let provider = new firebase.auth.FacebookAuthProvider();
            provider.addScope('public_profile');
            
            firebase.auth().signInWithPopup(provider).then(function(result) {
              let access_token = result.credential.accessToken;
              let user = result.user;
              
              this.setState({ 
                  auth: true,
                  user,
                  access_token
              });
            }.bind(this)).catch(function(error) {
              // Handle Errors here.
              let errorCode = error.code;
              let errorMessage = error.message;
              // The email of the user's account used.
              let email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              let credential = error.credential;
              // ...
              
              console.log( errorCode, errorMessage, email, credential );
            });
            
        }
        else {
            FB.logout((response) => {
                this.setState({ auth: false });
                console.log('Logged out.')
            });
        }
    }
    handleFetchDatas( postID ) {
        const 
            reactionsQuery = {
                'fields': 'name,pic_square,type',
                'filter': 'stream',
                'limit' : '5000'
            }, 
            commentsQuery = {
                'fields': 'attachment,from{id,name,picture},message,like_count,created_time',
                'filter': 'stream',
                'limit' : '5000'
            },
            sharedpostsQuery = {
                'fields': 'from{id,name,picture},message,created_time',
                'filter': 'stream',
                'limit' : '5000'
            };
        
        this.fetchData( 'reactions', `/${postID}/reactions`, reactionsQuery );
        this.fetchData( 'comments', `/${postID}/comments`, commentsQuery );
        this.fetchData( 'shareds', `/${postID}/sharedposts`, sharedpostsQuery );
    }
    render() {
        const { auth, access_token, reactions, comments, shareds, queried } = this.state;
        const queriedDone = queried.reactions === true && 
                            queried.comments  === true &&
                            queried.shareds   === true ;
        
        return (
            <div id="rc-main" >
                <div id="rc-title">
                    <h1>OH！開獎囉！</h1>
                </div>
                <div id="rc-body">
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
                            <FetchPost 
                                access_token={access_token}
                                onClick={this.handleFetchDatas.bind(this)}/>
                        }
                    </div> 
                    :
                    <Login onClick={this.handleFBLogin.bind(this)}/>
                }
                </div>
            </div>
        );
    }
}

export default App;
