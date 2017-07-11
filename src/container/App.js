import '../styles/App.scss'

import React, { Component } from 'react'
import update from 'react/lib/update'

import {TITLE_IMG} from '../img'

import { Button } from 'react-md'

import * as firebase from 'firebase'
import ReactGA from 'react-ga'

import { 
    Login,
    Lottery,
    FetchPost,
    DrawerMenu
} from '../components'

class App extends Component {
    state = {
        auth: false,
        authFailed: false,
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
        !function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/zh_TW/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk');
        
        ReactGA.initialize('UA-72706538-3');
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
        };
        
        ReactGA.pageview(`${window.location.pathname}`);

        !function() {
            var t;
            if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0, 
            t.methods = [ "identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], 
            t.factory = function(e) {
                return function() {
                    var n;
                    return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;
                };
            }, t.methods.forEach(function(e) {
                t[e] = t.factory(e);
            }), t.load = function(t) {
                var e, n, o, i;
                e = 3e5, i = Math.ceil(new Date() / e) * e, o = document.createElement("script"), 
                o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + i + "/" + t + ".js", 
                n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);
            });
        }();
        drift.SNIPPET_VERSION = '0.3.1';
        drift.load('ddxp7icbfzct');
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
              
              user = {
                  name: user.displayName,
                  email: user.email,
                  photoURL: user.photoURL
              };
              
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
              
              this.setState({ authFailed: true });
              console.warn( errorCode, errorMessage, email, credential );
            }.bind(this));
            
            
            FB.AppEvents.logEvent("handleLogin");
            ReactGA.ga('send', 'handleLogin');
        }
        else {
            firebase.auth().signOut();
            
            this.setState(update(this.state, {
                auth: { $set: false },
                access_token: { $set: '' },
                user: { $set: {} },
                comments: { $set: [] },
                reactions: { $set: [] },
                shareds: { $set: [] },
                queried: {
                    comments: { $set: false },
                    reactions: { $set: false },
                    shareds: { $set: false }
                }
            }));
            
            FB.AppEvents.logEvent("handleSignout");
            ReactGA.ga('send', 'handleSignout');
        }
        
        this.setState({authFailed: false});
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
                'limit' : '5000'
            },
            sharedpostsQuery = {
                'fields': 'from{id,name,picture},message,created_time',
                'limit' : '5000'
            };
        
        this.fetchData( 'reactions', `/${postID}/reactions`, reactionsQuery );
        this.fetchData( 'comments', `/${postID}/comments`, commentsQuery );
        this.fetchData( 'shareds', `/${postID}/sharedposts`, sharedpostsQuery );
        
        FB.AppEvents.logEvent("handleFetchDatas");
        ReactGA.ga('send', 'handleFetchDatas');
    }
    handleBack(){
        this.setState(update( this.state, {
            reactions: { $set: [] },
            comments: { $set: [] },
            shareds: { $set: [] },
            queried: {
                reactions: { $set: false },
                comments: { $set: false },
                shareds: { $set: false }
            }
        }));
    }
    render() {
        const { 
            auth, authFailed, 
            user, access_token, 
            reactions, comments, shareds, 
            queried 
        } = this.state;
        const queriedDone = queried.reactions === true && 
                            queried.comments  === true &&
                            queried.shareds   === true ;
        return (
            <div id="rc-main" >
                <DrawerMenu user={user} onSignOut={this.handleFBLogin.bind(this)}/>
                <div id="rc-title" className={ queriedDone ? 'up' : '' }>
                    <img className='sealIn' src={TITLE_IMG}/>
                </div>
                <div id="rc-body" className={ queriedDone ? 'up' : '' }>
                {
                    auth ?
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
                    <Login authFailed={authFailed} onClick={this.handleFBLogin.bind(this)}/>
                }
                </div>
                {
                    queriedDone ?
                    <Button id="rc-back" icon iconClassName='fa fa-chevron-left' tooltipLabel='上一步' onClick={this.handleBack.bind(this)}></Button>
                    : ''
                }
                
                    
                    <div id="rc-footer">
                        <div className="rc-version">BETA v0.1.4</div>
                        {
                            screen.width > 768 ?
                            <span>Copyright © 2017 <span className="fa fa-heart"></span> <b>OAwan</b></span>
                            : ''
                        }
                    </div>
                    
                
            </div>
        );
    }
}

export default App;
