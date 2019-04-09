import React from 'react';

const InitButton = ({ botIsActive, infoMessage, startChat }) => !botIsActive ? <div className="init-bot-btn">
    <button onClick={startChat} className="start-chat-btn">
        <i className="zmdi zmdi-arrow-right"></i>
    </button>
    <div className="start-chat-info">{infoMessage}</div>
</div> : null;

export default InitButton;