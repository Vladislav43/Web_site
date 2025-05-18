import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { fetchAuthMe } from './../redux/slices/auth';
import backgroundImage from './../photo/nature-pirs-more-priboi-rozovii-105616.jpeg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupIcon from '@mui/icons-material/Group'; // Replace Diversity1Icon with GroupIcon
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import io from 'socket.io-client';
import photo from './../pages/anceta/user-505.svg'; // Дефолтна аватарка для гостей
import instance from "./../redux/axios";

// Додайте цей коментар для підказки:
// Щоб працював real-time чат, встановіть бібліотеку socket.io-client:
// В терміналі у папці проекту виконайте:
//    npm install socket.io-client
// або
//    yarn add socket.io-client

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const messageFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const chatSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Функція для генерації кольору з рядка (user)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

export const Home = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth.data);
  const isAuthenticated = Boolean(authData);

  // Guest nickname logic
  const [guestName, setGuestName] = React.useState('Гість');
  const [guestAvatar, setGuestAvatar] = React.useState(photo);

  // Додаємо стан для користувача з анкети
  const [ancetaUser, setAncetaUser] = React.useState(null);

  // Отримати дані користувача з анкети (anceta)
  const fetchAncetaUser = async () => {
    if (!isAuthenticated || !authData?.token) return;
    try {
      const response = await instance.get("http://localhost:7300/anceta", {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
      // Знаходимо свою анкету по id (authData._id)
      const user = Array.isArray(response.data)
        ? response.data.find(u => u._id === authData._id)
        : null;
      setAncetaUser(user);
    } catch (e) {
      setAncetaUser(null);
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      setGuestName('Гість');
      setGuestAvatar(photo);
      setAncetaUser(null);
    } else {
      setGuestName('');
      setGuestAvatar('');
      fetchAncetaUser();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, authData?.token, authData?._id]);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  // Chat state
  const [chatOpen, setChatOpen] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState([]);
  const [chatInput, setChatInput] = React.useState('');
  const chatEndRef = useRef(null);

  // Socket.io підключення
  const socketRef = useRef(null);

  useEffect(() => {
    // Підключення до сокета
    socketRef.current = io('http://localhost:7300');
    // Отримання всіх повідомлень при підключенні
    socketRef.current.on('chatMessages', (msgs) => {
      setChatMessages(
        Array.isArray(msgs)
          ? msgs.map(m => ({
              ...m,
              avatar: m.avatar || (m.user === 'Гість' ? photo : m.avatar),
              user: m.user || m.fullname || 'Гість',
              color: stringToColor(m.user || 'Гість'),
            }))
          : []
      );
    });
    // Отримання нового повідомлення в реальному часі
    socketRef.current.on('chatMessage', (msg) => {
      setChatMessages((prev) => [
        ...prev,
        {
          ...msg,
          avatar: msg.avatar || (msg.user === 'Гість' ? photo : msg.avatar),
          user: msg.user || 'Гість',
          color: stringToColor(msg.user || 'Гість'),
        }
      ]);
    });

    // Запитати всі повідомлення при відкритті чату
    if (chatOpen) {
      socketRef.current.emit('getAllMessages');
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatOpen]);

  // Determine current user label and avatar
  const currentUserLabel = isAuthenticated
    ? (ancetaUser?.fullname || authData?.fullname || 'Користувач')
    : guestName;
  const currentUserAvatar = isAuthenticated
    ? (ancetaUser?.url || authData?.avatarUrl || photo)
    : guestAvatar;

  // Відправка повідомлення через сокет і бекенд
  const handleSendMessage = async () => {
    if (chatInput.trim()) {
      const msg = {
        text: chatInput,
        time: new Date().toLocaleTimeString().slice(0, 5),
        user: currentUserLabel,
        avatar: currentUserAvatar,
        color: stringToColor(currentUserLabel),
      };
      // Додаємо повідомлення одразу локально (гарантуємо унікальний колір)
      setChatMessages((msgs) => [
        ...msgs,
        {
          ...msg,
          avatar: msg.avatar || (msg.user === 'Гість' ? photo : msg.avatar),
          user: msg.user || 'Гість',
          color: stringToColor(msg.user || 'Гість'),
        }
      ]);
      try {
        await axios.post('http://localhost:7300/chat/messages', msg, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (socketRef.current) {
          socketRef.current.emit('chatMessage', msg);
        }
      } catch (e) {
        // Можна показати помилку, але повідомлення вже додано локально
      }
      setChatInput('');
    }
  };

  const handleChatInputKeyDown = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div
      className={styles.root}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <div
        className={styles.container}
        style={{
          background: 'rgba(255, 255, 255, 0.9)', // Brighter window
          padding: '30px',
          borderRadius: '20px',
          maxWidth: '700px',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
          animation: `${fadeIn} 1s ease-in-out`,
        }}
      >
        <div className={styles.info}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#ff5f6d',
              animation: `${pulse} 2s infinite`,
            }}
          >
            Знайомства, які змінюють життя
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '30px',
              color: '#333',
              animation: `${fadeIn} 1.5s ease-in-out`,
            }}
          >
            VoJeD - це платформа для знайомств, яка допомагає людям знайти справжні зв'язки. Ми прагнемо створити безпечне та комфортне середовище для спілкування та знайомств.
          </p>
        </div>
        <Link
          to={isAuthenticated ? '/anceta' : '/login'}
          className={styles.loginButton}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
            color: '#fff',
            padding: '15px 30px',
            borderRadius: '30px',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: '18px',
            transition: 'transform 0.3s ease',
            animation: `${bounce} 2s infinite`,
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          {isAuthenticated ? 'До анкети' : 'Увійти'}
        </Link>
      </div>

      {/* Updated Features Section */}
      <div
        className={styles.features}
        style={{
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { icon: <FavoriteIcon style={{ fontSize: '40px', color: '#ff5f6d' }} />, label: 'Справжні зв’язки' },
          { icon: <PersonSearchIcon style={{ fontSize: '40px', color: '#ffc371' }} />, label: 'Пошук партнерів' },
          { icon: <VerifiedIcon style={{ fontSize: '40px', color: '#ff5f6d' }} />, label: 'Перевірені профілі' },
          { icon: <GroupIcon style={{ fontSize: '40px', color: '#ffc371' }} />, label: 'Різноманітність' },
          { icon: <EventAvailableIcon style={{ fontSize: '40px', color: '#ff5f6d' }} />, label: 'Події та зустрічі' },
        ].map((feature, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              width: '150px',
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
              animation: `${fadeIn} 1s ease-in-out ${index * 0.2}s`,
            }}
          >
            {feature.icon}
            <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>{feature.label}</p>
          </div>
        ))}
      </div>

      {/* Чатік у правому нижньому кутку */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {/* Кнопка відкриття/закриття чату */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
              border: 'none',
              borderRadius: '50%',
              width: 56,
              height: 56,
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              outline: 'none',
            }}
            aria-label="Відкрити чат"
          >
            <ChatBubbleIcon sx={{ color: '#fff', fontSize: 32 }} />
          </button>
        )}
        {/* Вікно чату */}
        {chatOpen && (
          <div
            style={{
              width: 320,
              height: 400,
              background: 'rgba(255,255,255,0.98)',
              borderRadius: 18,
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: `${chatSlideIn} 0.4s cubic-bezier(.47,1.64,.41,.8)`,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
                Чат для спілкування
              </span>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 22,
                  cursor: 'pointer',
                  fontWeight: 700,
                  marginLeft: 8,
                }}
                aria-label="Закрити чат"
              >
                ×
              </button>
            </div>
            {/* Messages */}
            <div
              style={{
                flex: 1,
                padding: '12px 10px',
                overflowY: 'auto',
                background: '#f7f7f7',
                fontSize: 15,
              }}
            >
              {chatMessages.length === 0 && (
                <div style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>
                  Немає повідомлень. Напишіть перше!
                </div>
              )}
              {chatMessages.map((msg, idx) => {
                // Колір визначається лише по msg.user
                const isCurrentUser = msg.user === currentUserLabel;
                const userColor = stringToColor(msg.user);
                return (
                  <div
                    key={idx}
                    style={{
                      marginBottom: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                      animation: `${messageFadeIn} 0.5s cubic-bezier(.47,1.64,.41,.8)`,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 2,
                    }}>
                      <img
                        src={msg.avatar || photo}
                        alt="avatar"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `2px solid ${userColor}`,
                          background: '#fff',
                        }}
                      />
                      <span style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: userColor,
                        letterSpacing: 0.2,
                        marginRight: isCurrentUser ? 0 : 4,
                      }}>
                        {msg.user}
                        {isCurrentUser && (
                          <span
                            style={{
                              marginLeft: 6,
                              background: userColor,
                              color: '#fff',
                              fontSize: 10,
                              padding: '1px 7px',
                              borderRadius: 8,
                              fontWeight: 700,
                              letterSpacing: 0.5,
                              boxShadow: `0 1px 4px ${userColor}33`,
                              animation: `${pulse} 1.5s infinite`,
                            }}
                          >
                            Ви
                          </span>
                        )}
                      </span>
                    </div>
                    <div
                      style={{
                        background: isCurrentUser
                          ? `linear-gradient(135deg, ${userColor}, #ffc371)`
                          : '#ececec',
                        color: isCurrentUser ? '#fff' : userColor,
                        borderRadius: '16px',
                        padding: '7px 14px',
                        maxWidth: 210,
                        wordBreak: 'break-word',
                        fontWeight: 500,
                        boxShadow: isCurrentUser
                          ? `0 2px 8px ${userColor}22`
                          : '0 2px 8px #ccc',
                        border: `2px solid ${userColor}`,
                        position: 'relative',
                        transition: 'box-shadow 0.2s, border 0.2s',
                      }}
                    >
                      {msg.text}
                    </div>
                    <span style={{
                      fontSize: 11,
                      color: userColor,
                      marginTop: 2,
                      fontWeight: isCurrentUser ? 700 : 400,
                      letterSpacing: 0.2,
                      textShadow: isCurrentUser ? `0 1px 4px #ffc37155` : 'none',
                    }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderTop: '1px solid #eee',
                padding: '8px 10px',
                background: '#fff',
              }}
            >
              <input
                type="text"
                placeholder="Введіть повідомлення..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={handleChatInputKeyDown}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: 15,
                  padding: '8px',
                  borderRadius: 8,
                  background: '#f5f5f5',
                  marginRight: 8,
                }}
                maxLength={200}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  background: 'linear-gradient(135deg, #ff5f6d, #ffc371)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  color: '#fff',
                  fontSize: 20,
                }}
                aria-label="Відправити"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
