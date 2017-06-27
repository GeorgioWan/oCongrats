import React, { Component } from 'react'
import { Divider, Dialog } from 'react-md'

class InfoDialog extends Component {
    closeDialog(){
        const { closeDialog } = this.props;
        
        if( closeDialog )
            closeDialog();
    }
    render() {
        const { id, visible, title, content, image } = this.props;

        return (
            <Dialog 
                id={id}
                visible={visible}
                title={ title }
                focusOnMount={true}
                dialogStyle={ screen.width < 769 ? {width: '100%'} : { width: 640 }}
                actions={[{
                    onClick: this.closeDialog.bind(this),
                    primary: true,
                    label: '了解',
                }]}
                onHide={this.closeDialog.bind(this)}>
                <Divider />
                <div className='rc-dialog-info'>
                    { 
                        content 
                    }
                </div>
                <Divider />
                {
                    image ?
                    <div className="rc-dialog-img">
                        <img src={image}/>
                    </div>
                    : ''
                }
            </Dialog>
        );
    }
}

export default InfoDialog;
