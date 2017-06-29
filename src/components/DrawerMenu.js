import React, { Component } from 'react'
import { Button, Drawer, ListItem, Toolbar, Divider, FontIcon } from 'react-md'

import { InfoDialog } from './'

import { HOW, HOW_MOBILE } from '../img'

import ReactGA from 'react-ga'

const InfoIcon = () => <FontIcon>info</FontIcon>;
const ContactIcon = () => <FontIcon>question_answer</FontIcon>;

class DrawerMenu extends Component {
    state = {
        visible: false,
        how: false,
        howMobile: false,
        suggestion: false
    }
    handleClick(){
        const { visible } = this.state;
        this.setState({ visible: !visible });
    }
    handleToggle(visible){
        this.setState({visible});
    }
    handleClose(){
        this.setState({visible: false});
    }
    handleSignOut(){
        const { onSignOut } = this.props;
        
        this.setState({ visible: false });
        
        if(onSignOut)
            onSignOut();
    }
    handleOpenDialog(type){
        if ( type === 0 ){
            this.setState({ how: true });
            
            FB.AppEvents.logEvent("handleOpenDialog", null, {CONTENT_TYPE: 'how_pc'});
            ReactGA.ga('send', 'handleOpenDialog', 'reactions');
        }
        else if ( type === 1 ){
            this.setState({ howMobile: true });
            
            FB.AppEvents.logEvent("handleOpenDialog", null, {CONTENT_TYPE: 'how_mobile'});
            ReactGA.ga('send', 'handleOpenDialog', 'comments');
        }
        else if ( type === 2 ){
            this.setState({ suggestion: true });
            
            FB.AppEvents.logEvent("handleOpenDialog", null, {CONTENT_TYPE: 'suggestion'});
            ReactGA.ga('send', 'handleOpenDialog', 'shareds');
        }
        else if ( type === 3 ){
            FB.AppEvents.logEvent("handleOpenDialog", null, {CONTENT_TYPE: 'pages'});
            ReactGA.ga('send', 'handleOpenDialog', 'pages');
            
            window.open('https://www.facebook.com/ocongrats/', '_blank');
        }
    }
    closeDialog(){
        this.setState({ how: false, howMobile: false, suggestion: false });
    }
    render() {
        const { user } = this.props;
        const { visible } = this.state;
        const close = <Button icon onClick={this.handleClose.bind(this)}>arrow_forward</Button>;
        const header = (
            <Toolbar
                actions={close}
                className="md-divider-border md-divider-border--bottom"
            />
        );
        
        const items = [
            <ListItem primaryText="粉絲團" onClick={this.handleOpenDialog.bind(this, 3)} key={0}/>,
            <ListItem primaryText="「電腦版」如何取得文章連結" onClick={this.handleOpenDialog.bind(this, 0)} rightIcon={<InfoIcon />} key={1}/>,
            <ListItem primaryText="「手機版」如何取得文章連結" onClick={this.handleOpenDialog.bind(this, 1)} rightIcon={<InfoIcon />} key={2}/>,
            <ListItem primaryText="嘿！我想提供建議或幫助" onClick={this.handleOpenDialog.bind(this, 2)} rightIcon={<ContactIcon />} key={3}/>,
            <Divider key={4}/>,
        ];
        
        let key = 5 ;
        
        if ( user.name ) {
            items.push(
                <ListItem primaryText='' component={() => 
                    <div id="rc-drawer-user">
                        <img src={ user.photoURL } />
                        <h3>{user.name}</h3>
                        <span>{user.email || '－'}</span>
                    </div>
                } key={key++}/>);
                
            items.push(
                <ListItem primaryText='' component={() => 
                    <div id="rc-drawer-signout">
                        <Button raised primary label="登出" onClick={this.handleSignOut.bind(this)}></Button>
                    </div>
                } key={key++}/>);
        }
        
        if ( screen.width < 769 ) {
            items.push(
                <ListItem primaryText='' component={() => 
                    <div id="rc-drawer-footer">
                        Copyright © 2017 <span className="fa fa-heart"></span> <b>OAwan</b>
                    </div>
                } key={key++}/>);
        }
            
        return (
            <div id="rc-drawer">
                <Button icon iconClassName='fa fa-bars' onClick={this.handleClick.bind(this)}></Button>
                <Drawer 
                    visible={visible}
                    position='right'
                    header={header}
                    navItems={items}
                    type={Drawer.DrawerTypes.TEMPORARY}
                    style={{ zIndex: 999 }}
                    onVisibilityToggle={this.handleToggle.bind(this)}/>
                
                <InfoDialog
                    id='rc-dialog-how'
                    visible={ this.state.how }
                    title="「電腦版」如何取得文章連結"
                    content={[
                        <div key={0}>1. 貼文中找到<span className='rc-dialog-info-primary'>貼文時間</span></div>,
                        <div key={1}>2. 點擊<span className='rc-dialog-info-primary'>右鍵</span></div>,
                        <div key={2}>3. <span className='rc-dialog-info-primary'>複製連結網址</span>即可得到文章連結</div>
                    ]}
                    image={HOW}
                    closeDialog={this.closeDialog.bind(this)}/>
                <InfoDialog
                    id='rc-dialog-how-mobile'
                    visible={ this.state.howMobile }
                    title="「手機版」如何取得文章連結"
                    content={[
                        <div key={0}>1. 建議使用官方 App <span className='rc-dialog-info-primary'>專業小助手</span></div>,
                        <div key={1}>2. 於貼文點擊<span className='rc-dialog-info-primary'>分享</span></div>,
                        <div key={2}>3. <span className='rc-dialog-info-primary'>複製連結</span>即可得到文章連結</div>
                    ]}
                    image={HOW_MOBILE}
                    closeDialog={this.closeDialog.bind(this)}/>
                <InfoDialog
                    id='rc-dialog-suggestion'
                    visible={ this.state.suggestion }
                    title="嘿！我想偷偷告訴你們..."
                    content={[
                        <div key={0}>努力<span className='rc-dialog-info-primary'>開發中</span>，請先至粉絲團聯絡我們喲！</div>
                    ]}
                    closeDialog={this.closeDialog.bind(this)}/>
            </div>
        );
    }
}

export default DrawerMenu;
