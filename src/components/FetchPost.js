import React, { Component } from 'react'
import { Button, TextField } from 'react-md'

import { Spinner } from './'

class FetchPost extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            pgID: '',
            postID: '',
            error: false,
            errorText: '',
            fetching: false
        };
    }
    /**
        Parse Methods
    **/
    getPostID(url){
        const { access_token } = this.props;
        let postURL = url.split('/');
        
        if ( postURL.length <= 1 || !postURL.includes( 'www.facebook.com' ) ){
            this.setState({ 
                error: true,
                errorText: '請確認您填入的貼文連結是否正確。'
            });
            return;
        }
            
        let pgID = postURL[3] === 'groups' ? 4 : 3;
        let type = pgID + 1;
        
        // Get id
        FB.api(`/${postURL[ pgID ]}`, 'GET', {access_token}, function(response) {

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
            
            // Solve mobile copy URL.
            if ( postID.split(':').length > 0 )
                postID = postID.split(':')[0];
            
            FB.api(`/${pgID}_${postID}`, 'GET', {access_token}, function(response) {
                if ( response.error ){
                    this.setState({
                        error: true,
                        errorText: '您的貼文連結似乎不太對勁...再確認一下吧！'
                    });
                }
                else {
                    this.setState({ 
                        pgID, 
                        postID,
                        error: false,
                        errorText: ''
                    });
                }
                
            }.bind(this));
        }.bind(this));
    }
    /** 
        Handle Event 
    **/
    handleURLChange(e){
        if ( e === '' ){
            this.setState({ 
                pgID: e, 
                postID: e
            });
            return;
        }
        
        this.getPostID(e);
    }
    handleFetchDatas(){
        const { onClick } = this.props;
        const { pgID, postID } = this.state;
        
        if ( onClick ){
            onClick( `${pgID}_${postID}` );
            
            this.setState({
               fetching: true 
            });
        }
    }
    render() {
        const { pgID, postID, error, errorText, fetching } = this.state;
        let canIFetchNow = true;
        
        if  (pgID && pgID !== '' && postID && postID !== '')
            canIFetchNow = false;
        
        return (
            <div>
                <div id="rc-post-url">
                    <TextField id="post-url"
                               label="貼文連結"
                               placeholder="https://www.facebook.com/example/948794879487"
                               lineDirection='center'
                               error={error}
                               errorText={errorText}
                               disabled={fetching}
                               onChange={ this.handleURLChange.bind(this) }
                    />
                </div>
                {
                    fetching ? <Spinner /> : ''
                }
                <Button raised secondary
                    label="幫你抓一把"
                    disabled={ canIFetchNow || fetching } 
                    onClick={this.handleFetchDatas.bind(this)}></Button>
                <div className="rc-info-group">
                    <div className="rc-info"><b>留言‧按讚‧心情‧分享</b></div>
                    <div className="rc-info">能撈就撈，能抓就抓，抓好抓滿。</div>
                </div>
            </div>
        );
    }
}

export default FetchPost;
