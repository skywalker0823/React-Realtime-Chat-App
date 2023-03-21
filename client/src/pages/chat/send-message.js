import styles from './styles.module.css';
import React, {useState} from 'react';

const SendMessage = ({ socket,username,room }) => {
    const [message, setMessage] = useState('');

    // When the user clicks the send button, send the message to the server
    const sendMessage = () => {
        if(message !== ''){
            // 建立一個物件，用來儲存訊息的資料
            const __createdtime__ = Date.now();
            const data = {
                username: username,
                room: room,
                message: message,
                createdtime: __createdtime__,
            };
            // 將訊息傳送給server端
            socket.emit('send_message', data);
            // 清空訊息
            setMessage('');
        }
    }

    return (
        <div className={styles.sendMessageContainer}>
            <input
                className={styles.messageInput}
                placeholder='Type a message...'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <button className='btn btn-primary' onClick={sendMessage}>Send</button>
        </div>
    );
};

export default SendMessage;