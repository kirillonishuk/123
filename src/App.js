import React, { Component } from 'react';
import './App.css';
import Message from './Message';
import io from 'socket.io-client';
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
            image: '',
            filename: ''
        };

        const url = process.env.NODE_ENV === "development" ? config.url.dev : config.url.prod;
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
        let message = {
            bot: {
                type: config.bot.type,
                id: this.state.botId
            },
            user: this.state.userId
        };
        if (this.state.text || answer) {
            message = {
                ...message,
                type: 'message',
                text: answer || this.state.text
            };
        };
        if (this.state.image) {
            message = {
                ...message,
                image: this.state.image.split(',')[1],
                filename: this.state.filename,
                type: 'picture'
            };
        };
        if (message.type) {
            this.socket.emit('web-chat', message);
            if (!answer) {
                this.setState({
                    image: '',
                    text: '',
                    filename: ''
                })
            };
        };
        this.chat.focus();
    };

    startChat = () => {
        this.socket.emit('web-chat', {
            bot: {
                type: config.bot.type,
                id: this.state.botId
            },
            user: this.state.userId,
            text: '/start',
            type: 'message'
        })
    };

    loadImage = (event) => {
        const files = event.target.files;
        if (FileReader && files && files.length) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({
                    image: reader.result,
                    filename,
                });
            };
            const filename = files[0].name,
                file = files[0];
            event.target.files = null;
            reader.readAsDataURL(file);
            this.chat.focus();
        } else {
            alert('Error!')
        };
    };

    renderMessage = () => {
        return this.state.box.map((elem, id) => <Message sendMessage={this.sendMessage} key={id} {...elem} />)
    };

    renderInput = () => {
        // return <button
        //     className="start-chat-btn"
        //     onClick={this.startChat}
        // >Start</button>
        return <form className="send-message-form" onSubmit={this.sendMessage}>
            <label htmlFor="select-file" className="custom-select-input-file"></label>
            <input type="file" id="select-file" accept="image/*" onChange={this.loadImage} />
            <input
                ref={ref => this.chat = ref}
                className="message-input"
                value={this.state.text}
                onChange={this.changeMessage}
                type="text"
                placeholder="Введите сообщение..."
            />
            <div className="send-message-button" onClick={this.sendMessage}></div>
        </form>
    };

    render() {
        return (
            <div className="chat-container">
                <div className="bot-connection-container">
                    <label htmlFor="bot-id-input">ID Бота: </label>
                    <input
                        autoFocus
                        type="text"
                        id="bot-id-input"
                        placeholder="Введите ID"
                        value={this.state.botId}
                        onChange={(event) => { this.setState({ botId: event.target.value }) }}
                    />
                </div>
                <div className="message-container" ref={ref => { this.chatbox = ref }}>
                    <div className="scroll-fix"></div>
                    {this.renderMessage()}
                </div>
                {this.renderInput()}
            </div>
        );
    };
}

export default App;
