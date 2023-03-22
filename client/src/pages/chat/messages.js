import styles from './styles.module.css';
import { useEffect, useState , useRef} from 'react';

const Messages = ({ socket }) => {

    // 宣告messages狀態，並設置初始值為空陣列
    // messagesReceived 是用來儲存接收到的訊息的狀態
    // setMessagesReceived 是用來設置messagesReceived狀態的函式
    const [messagesReceived, setMessagesReceived] = useState([]);
    const messagesColumnRef = useRef(null);
    
    // 收到 socket server 的訊息時，會觸發這個函式
    useEffect(() => {
        // 當接收到server端的message事件時，會觸發這個函式
        socket.on('receive_message', (data) => {
            // 這是接收到的訊息 
            console.log(data);
            // 將訊息加入到messagesReceived狀態中
            setMessagesReceived((state)=>[
                ...state,
                {
                    username: data.username,
                    message: data.message,
                    createdtime: data.createdtime,
                }
            ])
        });
        return () => {
            // 當元件被移除時，會觸發這個函式
            // 移除socket的message事件
            socket.off('receive_message');
        }
    }, [socket]);


    // get last 100 messages and sort by date
    useEffect(() => {
      socket.on('last_100_messages',(last100Messages)=>{
        last100Messages = JSON.parse(last100Messages);
        last100Messages = sortMessagesByDate(last100Messages);

        setMessagesReceived((state)=>[
          ...last100Messages,
          ...state]);
      });
      return () => socket.off('last_100_messages');
    }, [socket]);


    // scroll to bottom of messages column
    useEffect(() => {
      messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]);

    // sort messages by date
    let sortMessagesByDate = (messages) => {
      return messages.sort((a, b) => parseInt(a.createdtime) - parseInt(b.createdtime));
    }

    // format timestamp
    let formatDataFromTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }



    // let formatDataFromTimestamp = (timestamp) => {
    //     const date = new Date(timestamp);
    //     return date.toLocaleString();
    // }
    
    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
        {messagesReceived.map((msg, i) => (
          <div className={styles.message} key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={styles.msgMeta}>{msg.username}</span>
              <span className={styles.msgMeta}>
                {formatDataFromTimestamp(msg.createdtime)}
              </span>
            </div>
            <p className={styles.msgText}>{msg.message}</p>
            <br />
          </div>
        ))}
      </div>
    );
}

export default Messages;