import styles from './styles.module.css';
// 引入useNavigate 用來導向chat頁面
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    // 宣告navigate函式
    const navigate = useNavigate();
    // 當使用者點擊Join Room按鈕時，會觸發onClick事件
    const joinRoom = () => {
        // 如果使用者沒有輸入名稱或房間，則不會觸發任何事件
        if (!username || !room) return;
        // 如果使用者輸入了名稱和房間，則會觸發joinRoom事件，並將使用者名稱和房間傳遞給server端
        console.log('joinRoom Activate', username, room);
        socket.emit('joinRoom', { username, room });
        // 導向chat頁面
        navigate('/chat',{ replace: true });
    };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`React-chat-app`}</h1>
        <input
            className={styles.input}
            placeholder='Username...'
            // 當使用者輸入時，會觸發onChange事件，並將輸入的值傳遞給setUsername函式
            onChange={(e) => setUsername(e.target.value)}
            />

        <select
            className={styles.input}
            // 當使用者選擇房間時，會觸發onChange事件，並將選擇的值傳遞給setRoom函式
            onChange={(e) => setRoom(e.target.value)}
            >
          <option>-- Select Room --</option>
          <option value='rta'>Room type A</option>
          <option value='rtb'>Room type B</option>
          <option value='rtc'>Room type C</option>
          <option value='rtd'>Room type D</option>
        </select>
        <button className='btn btn-secondary' style={{ width: "100%" }} onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default Home;