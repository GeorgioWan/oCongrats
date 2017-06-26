import React, { Component } from 'react'
import { Button, Drawer, ListItem, Toolbar, Divider, FontIcon } from 'react-md'

const InfoIcon = () => <FontIcon>info</FontIcon>;
const ContactIcon = () => <FontIcon>question_answer</FontIcon>;

class DrawerMenu extends Component {
    state = {
        visible: false
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
    render() {
        const { user } = this.props;
        const { visible } = this.state;
        const close = <Button icon onClick={this.handleClose.bind(this)}>arrow_back</Button>;
        const header = (
            <Toolbar
                actions={close}
                className="md-divider-border md-divider-border--bottom"
            />
        );
        const items = [
            <ListItem primaryText="粉絲團" key={0}/>,
            <ListItem primaryText="「電腦版」如何取得文章連結" rightIcon={<InfoIcon />} key={1}/>,
            <ListItem primaryText="「手機版」如何取得文章連結" rightIcon={<InfoIcon />} key={2}/>,
            <ListItem primaryText="嘿！我想提供建議或幫助" rightIcon={<ContactIcon />} key={3}/>,
            <Divider key={4}/>,
        ];
        
        if ( user.email ) {
            items.push(
                <ListItem primaryText='' component={() => 
                    <div id="rc-drawer-user">
                        <img src={ user.photoURL } />
                        <h3>{user.name}</h3>
                        <span>{user.email}</span>
                    </div>
                } key={5}/>);
                
            items.push(
                <ListItem primaryText='' component={() => 
                    <div id="rc-drawer-signout">
                        <Button raised primary label="登出" onClick={this.handleSignOut.bind(this)}></Button>
                    </div>
                } key={6}/>);
        }
            
        return (
            <div id="rc-drawer">
                <Button icon iconClassName='fa fa-bars' onClick={this.handleClick.bind(this)}></Button>
                <Drawer 
                    visible={visible}
                    position='left'
                    header={header}
                    navItems={items}
                    type={Drawer.DrawerTypes.TEMPORARY}
                    style={{ zIndex: 999 }}
                    onVisibilityToggle={this.handleToggle.bind(this)}/>
            </div>
        );
    }
}

export default DrawerMenu;
