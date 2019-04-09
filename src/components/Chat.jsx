import React from 'react';
import Message from './Message/Message';

const Chat = ({ box }) => box.map((elem, id) => <Message key={id} {...elem} />);

export default Chat;