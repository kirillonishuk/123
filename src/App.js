import React, { Component } from 'react';
import './App.css';
import Message from './Message';
import io from 'socket.io-client';
import wmsgParser from './socket';
import config from './config/config.json';

class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            botId: '',
            userId: new Date().getTime() * Math.floor(Math.random() * 999 + 1),
            text: "",
            box: [],
            image: '',
            filename: ''
        };

        this.socket = io('wss://localhost:3015', {
            path: '/ws', transports: ['websocket']
        })
        this.socket.on('web-bot-message', (wmsg) => {
            const result = wmsgParser(wmsg);

            this.setState({
                box: this.state.box.concat(result)
            })
        })
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.box.length !== prevState.box.length) {
            this.scrollToBottom();
        };
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

    sendMessage = (event) => {
        event.preventDefault();
        let message = {
            bot: {
                type: config.bot.type,
                id: this.state.botId
            },
            user: this.state.userId
        };
        if (this.state.text) {
            message = {
                ...message,
                type: 'message',
                text: this.state.text
            };

            this.setState((prevState) => {
                return {
                    text: '',
                    box: prevState.box.concat({
                        text: prevState.text,
                        type: 'outgoing',
                        form: 'message'
                    })
                }
            })
        };
        if (this.state.image) {
            message = {
                ...message,
                image: this.state.image.split(',')[1],
                filename: this.state.filename,
                type: 'picture'
            };

            this.setState((prevState) => {
                return {
                    image: '',
                    filename: '',
                    box: prevState.box.concat({
                        image: prevState.image.split(',')[1],
                        type: 'outgoing',
                        form: 'image'
                    })
                }
            });
        };
        if (message.type)
            this.socket.emit('web-chat', message);
    }

    renderMessage = () => {
        return this.state.box.map((elem, id) => <Message key={id} {...elem} />)
    }

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
    }

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
            reader.readAsDataURL(file);
            event.target.files = null;
            this.chat.focus();
        } else {
            alert('Error!')
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="bot-connection">
                    <label htmlFor="bot-id">Bot:ID </label>
                    <input
                        type="text"
                        id="bot-id"
                        value={this.state.botId}
                        onChange={(event) => { this.setState({ botId: event.target.value }) }}
                    />
                </div>
                <div className="App" ref={ref => { this.chatbox = ref }}>
                    {this.renderMessage()}
                </div>
                {!this.state.box.length ?
                    <button
                        className="chat-input start-chat-btn"
                        onClick={this.startChat}
                    >Start</button>
                    :
                    <form onSubmit={this.sendMessage}>
                        <input
                            ref={ref => this.chat = ref}
                            autoFocus
                            className="chat-input App-input"
                            value={this.state.text}
                            onChange={this.changeMessage}
                            type="text"
                            placeholder="Введите сообщение..."
                        />
                        <label htmlFor="select-file" className="custom-input-file"></label>
                        <input type="file" id="select-file" accept="image/*" onChange={this.loadImage} />
                    </form>}
                {this.state.image ?
                    <img src={this.state.image} className="selected-image" alt="selected" />
                    :
                    null}
            </React.Fragment>
        );
    };
}

export default App;
