import React, { Component } from 'react';
import io from 'socket.io-client';
import classNames from 'classnames';
import './App.css';
import Message from './Message';
import wmsgParser from './socket';
import config from './config/config.json';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            botId: '',
            userId: crypto.getRandomValues(new Uint32Array(1)).toString() + '-' + new Date().getTime().toString(),
            text: '',
            box: [],
            botIsActive: false,
            isIdInPath: false,
            infoMessage: 'Введите ID бота и нажмите на кнопку для начала общения с ним.',
            buttons: []
        };

        const url = config.urlWs[process.env.NODE_ENV];
        if (window.location.port === '3016' || process.env.NODE_ENV === 'development') {
            this.socket = io(url, {
                path: '/ws-bot', transports: ['websocket']
            });
        } else {
            this.socket = io({
                path: '/ws-bot', transports: ['websocket']
            });
        };

        this.socket.on('web-bot-message', (wmsg) => {
            const result = wmsgParser(wmsg);

            if (!(result.text === "/start" && result.type === "outgoing")) {
                if (result.form === 'keyboard') {
                    console.log(result);
                    this.setState({
                        buttons: result.buttons
                    });
                } else {
                    this.setState({
                        box: this.state.box.concat(result)
                    });
                };
            };
        });

        this.socket.on('web-bot-error', (wmsg) => {
            console.log(wmsg)
        });
    };

    componentDidMount() {
        const urls = window.location.pathname.split('/').filter(elem => elem);
        let botId;
        if (urls.length && urls[0] === 'chat') {
            botId = urls[1];
        } else if (urls.length) {
            botId = urls[0];
        };
        if (botId) {
            this.setState({
                botId: botId,
                isIdInPath: true,
                infoMessage: 'Нажмите на кнопку для начала общения с ботом.'
            }, () => {
                if (window.location.hash === "#start") {
                    this.startChat();
                }

            });
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.box.length !== prevState.box.length) {
            this.scrollToBottom();
        };
    };

    componentWillUnmount() {
        this.socket.close();
    };

    scrollToBottom = () => {
        if (this.chatbox) {
            this.chatbox.scrollTop = this.chatbox.scrollHeight;
        };
    };

    changeMessage = (event) => {
        this.setState({
            text: event.target.value
        })
    };

    sendMessage = (event, answer) => {
        event.preventDefault();
        event.stopPropagation();
        if (!this.state.botIsActive) return;

        let message = {
            bot: {
                type: config.bot.type,
                id: this.state.botId
            },
            user: this.state.userId,
            type: 'message',
            text: answer || this.state.text
        };
        this.socket.emit('web-chat', message);
        if (!answer) {
            this.setState({
                text: '',
                buttons: []
            });
        } else {
            this.setState({
                buttons: []
            });
        };
        this.chat.disabled = false;
        this.chat.focus();
    };

    startChat = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.socket.emit('web-chat', {
            bot: {
                type: config.bot.type,
                id: this.state.botId
            },
            user: this.state.userId,
            text: '/start',
            type: 'message'
        });
        this.setState({
            botIsActive: true
        })
        this.chat.disabled = false;
        this.chat.focus();
    };

    loadImage = (event) => {
        if (!this.state.botIsActive) {
            return;
        };

        const files = event.target.files,
            filename = files[0].name,
            file = files[0];
        if (FileReader && files && files.length) {
            const reader = new FileReader();
            reader.onload = () => {
                let message = {
                    bot: {
                        type: config.bot.type,
                        id: this.state.botId
                    },
                    user: this.state.userId,
                    image: reader.result.split(',')[1],
                    filename: filename,
                    type: 'picture'
                };
                this.socket.emit('web-chat', message);
            };

            reader.readAsDataURL(file);
            event.target.value = '';
            this.chat.focus();
        } else {
            alert('Error!')
        };
    };

    loadDoc = (event) => {
        if (!this.state.botIsActive) {
            return;
        };

        const files = event.target.files,
            filename = files[0].name,
            file = files[0];
        if (FileReader && files && files.length) {
            const reader = new FileReader();
            reader.onload = () => {
                let message = {
                    bot: {
                        type: config.bot.type,
                        id: this.state.botId
                    },
                    user: this.state.userId,
                    file: reader.result.split(',')[1],
                    filename: filename,
                    type: 'file'
                };
                this.socket.emit('web-chat', message);
            };

            reader.readAsDataURL(file);
            event.target.value = '';
            this.chat.focus();
        } else {
            alert('Error!')
        };
    };

    renderMessage = () => {
        return this.state.box.map((elem, id) => <Message sendMessage={this.sendMessage} key={id} {...elem} />)
    };

    renderInitButton = () => {
        if (!this.state.botIsActive) return <div className="init-bot-btn">
            <button onClick={this.startChat} className="start-chat-btn">
                <i className="zmdi zmdi-arrow-right"></i>
            </button>
            <div className="start-chat-info">{this.state.infoMessage}</div>
        </div>
    };

    renderInput = () => {
        const blockerStyles = classNames({
            'blocker-hide': this.state.botIsActive,
            'blocker': true
        });

        return <form className="send-message-form" onSubmit={this.sendMessage}>
            <div className={blockerStyles}></div>
            <label htmlFor="select-image" className="custom-select-input-image">
                <i className="zmdi zmdi-camera-add"></i>
            </label>
            <input
                type="file"
                id="select-image"
                accept="image/*"
                onChange={this.loadImage}
                disabled={!this.state.botIsActive}
            />
            <label htmlFor="select-doc" className="custom-select-input-doc">
                <i className="zmdi zmdi-attachment-alt"></i>
            </label>
            <input
                type="file"
                id="select-doc"
                onChange={this.loadDoc}
                disabled={!this.state.botIsActive}
            />
            <input
                ref={ref => this.chat = ref}
                className="message-input"
                value={this.state.text}
                onChange={this.changeMessage}
                type="text"
                placeholder="Введите сообщение..."
                disabled={!this.state.botIsActive}
            />
            <div className="send-message-button" onClick={this.sendMessage}>
                <i className="zmdi zmdi-mail-send"></i>
            </div>
        </form>
    };

    renderButtons = () => {
        if (this.state.buttons.length)
            return (
                <div className="buttons-container">
                    {this.state.buttons.map((button, id) =>
                        <div className="answer-button" key={id} onClick={(event) => this.sendMessage(event, button.text)}>
                            {button.text.toUpperCase()}
                        </div>
                    )}
                </div>)
    }

    render() {
        let form = this.state.isIdInPath ?
            <div className="bot--header"></div>
            :
            <form className="bot-connection-container" onSubmit={this.startChat} autoComplete="off">
                <label htmlFor="bot-id-input">ID Бота: </label>
                <input
                    autoFocus
                    type="text"
                    id="bot-id-input"
                    placeholder="Введите ID"
                    value={this.state.botId}
                    onChange={(event) => { this.setState({ botId: event.target.value }) }}
                />
            </form>;

        return (
            <div className="chat-container">
                {form}
                <div className="message-container" ref={ref => { this.chatbox = ref }}>
                    <div className="scroll-fix"></div>
                    {this.renderInitButton()}
                    {this.renderMessage()}
                </div>
                {this.renderButtons()}
                {this.renderInput()}
            </div>
        );
    };
}

export default App;
