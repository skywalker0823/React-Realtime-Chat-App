// 引入CSS樣式表
import './App.css';
// 引入React Router中的Router、Routes、Route 元件
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 引入Home元件
import Home from './pages/home';
// 引入useState 用來設置狀態
import { useState } from 'react';
// 引入socket.io-client 來建立socket連線
import io from 'socket.io-client';
// 引入Chat元件
import Chat from './pages/chat';

// method 0: from the same domain as the client
//get url exclude port
const current_url = window.location.protocol + '//' + window.location.hostname;
const port = process.env.PORT || 4000;
const socket = io(current_url + ':' + port,{
  extraHeaders:{
    "from-websocket-with-love": true
  }
});

// 建立socket連線,server端的連線網址為http://localhost:4000
// const socket = io('http://192.168.181.58:4000');

// method 2: Use window.location.origin to get the origin of the current page.
// const socket = io(window.location.origin);

//method 3 : DNS over HTTPS




// 定義App元件
function App() {
  //宣告username和room的狀態，並設置初始值為空字串
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  return (
    // 使用Router元件包覆整個App元件 以便使用Router中的功能
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/'
                 element={
                 <Home
                 // 將username和room的狀態傳遞給home元件 就可以在home元件(/pages/home/index.js)中使用這些狀態 
                  username = {username}
                  setUsername = {setUsername}
                  room = {room}
                  setRoom = {setRoom}
                  socket = {socket}
                  />
                 } />
          <Route path='/chat'
                  element={
                  <Chat
                  // 將username和room的狀態傳遞給chat元件 就可以在chat元件(/pages/chat/index.js)中使用這些狀態
                  username = {username}
                  room = {room}
                  socket = {socket}
                  />} 
                />
    
        </Routes>
      </div>
    </Router>
  );
}

export default App;



// 我們可以在home元件中設置狀態來儲存使用者/房間的資料(state)，但chat元件也會需要這些東西
// 因此我們可以將這些資料放在App元件中，並將它們傳遞給home和chat元件

// npm start