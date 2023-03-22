import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers =({socket,room,username})=>{
    const [roomUsers,setRoomUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        socket.on('chatroom_users',(data)=>{
            setRoomUsers(data);
        });
        return () => socket.off('chatroom_users');
    },[socket]);

    const leaveRoom = () => {
        const createdtime = Date.now();
        socket.emit('leave_room', { username, room, createdtime });
        navigate('/',{replace:true});
    };
    return (
    <div className={styles.roomAndUsersColumn}>
      <h2 className={styles.roomTitle}>{room}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
        <ul className={styles.usersList}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
              }}
              key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default RoomAndUsers;
    