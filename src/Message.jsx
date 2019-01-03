import React, { Component } from 'react';
import './Message.css';
import classNames from 'classnames';
import mime from 'mime-types';


class Message extends Component {

    createFile = () => {
        console.log(this.props.file.byteLength);
        const file = new Blob([this.props.file], { type: mime.lookup(this.props.name.split('.')[1]) });
        console.log(file);

        return URL.createObjectURL(file)
    }

    renderMessage = {
        'message': (messageType) => <div className={messageType}>
            {this.props.text}
        </div>,
        'image': (messageType) => <div className={messageType}>
            <img
                src={`data:image/png;base64,${this.props.image}`}
                alt="sending"
            />
        </div>,
        'file': (messageType) => <div className={messageType}>
            <a
                href={this.createFile()}
                download={this.props.name}
                className="file-download"
            >{this.props.name}</a>
            <div className="file-size">{`${this.props.file.byteLength} байт`}</div>
        </div>,
    }
    render() {
        const messageType = classNames({
            'outgoing': this.props.type === 'outgoing',
            'incoming': this.props.type === 'incoming',
            'image': this.props.form === 'image',
            'message-box': true
        });

        return this.renderMessage[this.props.form](messageType);
    };
}

export default Message;
