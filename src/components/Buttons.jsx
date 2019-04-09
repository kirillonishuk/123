import React from 'react';

const Buttons = ({ buttons, sendMessage }) => buttons.length ? <div className="buttons-container">
    {buttons.map(button =>
        <div className="answer-button" key={button.text} onClick={(event) => sendMessage(event, button.text)}>
            {button.text.toUpperCase()}
        </div>
    )}
</div> : null;

export default Buttons;