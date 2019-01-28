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
            botIsActive: false
        };

        const url = config.urlWs[process.env.NODE_ENV];
        this.socket = io(url, {
            path: '/ws', transports: ['websocket']
        });

        this.socket.on('web-bot-message', (wmsg) => {
            const result = wmsgParser(wmsg);

            this.setState({
                box: this.state.box.concat(result)
            })
        });
    };

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
                text: ''
            })
        };
        this.chat.disabled = false;
        this.chat.focus();
    };

    startChat = (event) => {
        event.preventDefault();
        event.stopPropagation();

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

    renderMessage = () => {
        return this.state.box.map((elem, id) => <Message sendMessage={this.sendMessage} key={id} {...elem} />)
    };

    renderInitButton = () => {
        if (!this.state.botIsActive) return <div className="init-bot-btn">
            <button onClick={this.startChat} className="start-chat-btn">
                <i className="zmdi zmdi-arrow-right"></i>
            </button>
            <div className="start-chat-info">Введите ID бота и нажмите на кнопку для начала общения с ним.</div>
        </div>
    };

    renderInput = () => {
        const blockerStyles = classNames({
            'blocker-hide': this.state.botIsActive,
            'blocker': true
        });

        return <form className="send-message-form" onSubmit={this.sendMessage}>
            <div className={blockerStyles}></div>
            <label htmlFor="select-file" className="custom-select-input-file"></label>
            <input
                type="file"
                id="select-file"
                accept="image/*"
                onChange={this.loadImage}
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
            <div className="send-message-button" onClick={this.sendMessage}></div>
        </form>
    };

    render() {
        return (
            <div className="chat-container">
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
                </form>
                <div className="message-container" ref={ref => { this.chatbox = ref }}>
                    <div className="scroll-fix"></div>
                    {this.renderInitButton()}
                    {this.renderMessage()}
                </div>
                {this.renderInput()}
            </div>
        );
    };
}

export default App;
