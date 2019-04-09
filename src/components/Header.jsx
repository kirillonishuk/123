import React from 'react';

const Header = ({ isIdInPath, botId, startChat, setBotId }) => isIdInPath ?
    <div className="bot--header"></div> :
    <form className="bot-connection-container" onSubmit={startChat} autoComplete="off">
        <label htmlFor="bot-id-input">ID Бота: </label>
        <input
            autoFocus
            type="text"
            id="bot-id-input"
            placeholder="Введите ID"
            value={botId}
            onChange={setBotId}
        />
    </form>;

export default Header;