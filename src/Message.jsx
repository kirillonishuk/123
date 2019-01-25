import React, { Component } from 'react';
import './Message.css';
import classNames from 'classnames';
import mime from 'mime-types';


class Message extends Component {

    createFile = () => {
        const file = new Blob([this.props.file], { type: this.props.mime || mime.lookup(this.props.name.split('.')[1]) });

        return URL.createObjectURL(file)
    };

    renderButtons = () => {
        return this.props.buttons.map((button, id) =>
            <div className="answer-button" key={id} onClick={(event) => this.props.sendMessage(event, button.text)}>
                {button.text}
            </div>
        )
    };

    linkify = (text) => {
        // http://, https://, ftp://
        const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        // www. sans http:// or https://
        const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        // Email addresses
        const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

        return text
            .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
            .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
            .replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>');
    }

    renderTime = () => <div className="message-time">{this.props.time.getHours() + ':' + this.props.time.getMinutes()}</div>

    renderMessage = {
        'message': (messageType) => <div className={messageType}>
            <span dangerouslySetInnerHTML={{ __html: this.linkify(this.props.text) }}></span>
            {this.renderTime()}
        </div>,
        'image': (messageType) => <div className={messageType}>
            <img
                src={`data:image/png;base64,${this.props.image}`}
                alt="sending"
            />
            {this.renderTime()}
        </div>,
        'file': (messageType) => <div className={messageType}>
            <a
                href={this.createFile()}
                download={this.props.name}
                className="file-download"
            >{this.props.name}</a>
            <div className="file-size">{`${this.props.file.byteLength} байт`}</div>
            {this.renderTime()}
        </div>,
        'audio': (messageType) => <div className={messageType}>
            <audio controls className="voice-msg">
                <source src={this.createFile()} type={this.props.mime} />
            </audio>
            {this.renderTime()}
        </div>,
        'keyboard': (messageType) => <div className={messageType}>
            {this.renderButtons()}
            {this.renderTime()}
        </div>,
    };

    render() {
        const messageType = classNames({
            'message-box': !this.props.buttons,
            'buttons-box': this.props.buttons,
            'outgoing': this.props.type === 'outgoing',
            'incoming': this.props.type === 'incoming',
            'image': this.props.form === 'image'
        });

        return this.renderMessage[this.props.form](messageType);
    };
}

export default Message;