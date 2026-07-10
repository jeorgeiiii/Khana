import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/v1';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: "Hi! I can set up a daily thali order for you. Try:\n\n\"order the cheapest thali every day at 2pm and 9pm\"\n\nor name a restaurant:\n\n\"order a thali from Apna Sweets daily at 2pm\""
        }
    ]);
    const bottomRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, open]);

    const send = async () => {
        const text = input.trim();
        if (!text || sending) return;

        setMessages(prev => [...prev, { role: 'user', text }]);
        setInput('');
        setSending(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessages(prev => [...prev, { role: 'bot', text: 'Please log in first to set up daily orders.' }]);
                setSending(false);
                return;
            }

            const res = await fetch(`${API_BASE}/chatbot/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: text })
            });

            if (res.status === 401) {
                localStorage.removeItem('token');
                setMessages(prev => [...prev, { role: 'bot', text: 'Your session expired. Please log in again.' }]);
                setTimeout(() => navigate('/login'), 1200);
                return;
            }

            const data = await res.json();

            // The controller returns { success, reply, subscription? }
            setMessages(prev => [...prev, {
                role: 'bot',
                text: data.reply || data.message || 'Something went wrong.',
                createdSub: !!data.subscription
            }]);

        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, {
                role: 'bot',
                text: "I couldn't reach the server. Is the backend running?"
            }]);
        } finally {
            setSending(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    // ---- styles (inline, no CSS file) ----
    const fab = {
        position: 'fixed', bottom: '24px', right: '24px',
        width: '58px', height: '58px', borderRadius: '50%',
        background: '#e23744', color: '#fff', border: 'none',
        fontSize: '26px', cursor: 'pointer', zIndex: 1000,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)'
    };
    const panel = {
        position: 'fixed', bottom: '96px', right: '24px',
        width: '360px', maxWidth: 'calc(100vw - 48px)',
        height: '480px', maxHeight: 'calc(100vh - 140px)',
        background: '#fff', borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', zIndex: 1000
    };
    const header = {
        background: '#e23744', color: '#fff',
        padding: '14px 18px', fontWeight: 600, fontSize: '15px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    };
    const body = {
        flex: 1, overflowY: 'auto', padding: '16px',
        background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '10px'
    };
    const bubble = (isUser) => ({
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        background: isUser ? '#e23744' : '#fff',
        color: isUser ? '#fff' : '#333',
        border: isUser ? 'none' : '1px solid #eee',
        padding: '10px 14px', borderRadius: '12px',
        maxWidth: '80%', fontSize: '14px', lineHeight: 1.5,
        whiteSpace: 'pre-wrap'
    });
    const footer = {
        display: 'flex', gap: '8px', padding: '12px',
        borderTop: '1px solid #eee', background: '#fff'
    };
    const inputStyle = {
        flex: 1, border: '1px solid #ddd', borderRadius: '20px',
        padding: '10px 16px', fontSize: '14px', outline: 'none'
    };
    const sendBtn = {
        background: '#e23744', color: '#fff', border: 'none',
        borderRadius: '20px', padding: '10px 18px',
        cursor: sending ? 'not-allowed' : 'pointer',
        fontWeight: 600, fontSize: '14px', opacity: sending ? 0.6 : 1
    };

    return (
        <>
            {open && (
                <div style={panel}>
                    <div style={header}>
                        <span>🍛 Thali Assistant</span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
                        >×</button>
                    </div>

                    <div style={body}>
                        {messages.map((m, i) => (
                            <div key={i} style={bubble(m.role === 'user')}>
                                {m.text}
                                {m.createdSub && (
                                    <div style={{ marginTop: '10px' }}>
                                        <button
                                            onClick={() => navigate('/subscriptions')}
                                            style={{
                                                background: '#fff', color: '#e23744',
                                                border: '1px solid #e23744', borderRadius: '6px',
                                                padding: '5px 12px', fontSize: '12px',
                                                fontWeight: 600, cursor: 'pointer'
                                            }}
                                        >
                                            View my daily orders →
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {sending && (
                            <div style={bubble(false)}>
                                <span style={{ color: '#999' }}>typing…</span>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div style={footer}>
                        <input
                            style={inputStyle}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder="e.g. cheapest thali daily at 2pm"
                            disabled={sending}
                        />
                        <button style={sendBtn} onClick={send} disabled={sending}>
                            Send
                        </button>
                    </div>
                </div>
            )}

            <button
                style={fab}
                onClick={() => setOpen(o => !o)}
                title="Thali Assistant"
            >
                {open ? '×' : '🍛'}
            </button>
        </>
    );
};

export default ChatBot;