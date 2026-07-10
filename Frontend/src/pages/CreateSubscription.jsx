import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/v1';

const CreateSubscription = () => {
    const [mode, setMode] = useState('cheapest');
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantId, setRestaurantId] = useState('');
    const [maxPrice, setMaxPrice] = useState(300);
    const [times, setTimes] = useState({ lunch: true, dinner: true });
    const [customTime, setCustomTime] = useState('');
    const [address, setAddress] = useState({ street: '', city: 'Indore', state: 'MP', pincode: '' });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'ok'|'err', text }
    const navigate = useNavigate();

    // Load restaurants for the "fixed" dropdown
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API_BASE}/resturant/location/Indore`);
                const data = await res.json();
                setRestaurants(data.restaurants || data.resturants || []);
            } catch (e) {
                console.error('Could not load restaurants', e);
            }
        };
        load();
    }, []);

    const buildMealTimes = () => {
        const out = [];
        if (times.lunch) out.push('14:00');
        if (times.dinner) out.push('21:00');
        if (customTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(customTime)) out.push(customTime);
        return [...new Set(out)].sort();
    };

    const submit = async () => {
        setMessage(null);

        const mealTimes = buildMealTimes();
        if (mealTimes.length === 0) {
            setMessage({ type: 'err', text: 'Pick at least one meal time.' });
            return;
        }
        if (mode === 'fixed' && !restaurantId) {
            setMessage({ type: 'err', text: 'Choose a restaurant.' });
            return;
        }
        if (!address.street.trim()) {
            setMessage({ type: 'err', text: 'Enter a delivery address.' });
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            const res = await fetch(`${API_BASE}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    mode,
                    restaurantId: mode === 'fixed' ? restaurantId : undefined,
                    mealTimes,
                    maxPrice: Number(maxPrice),
                    deliveryAddress: address
                })
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'ok', text: 'Daily order set up! Redirecting…' });
                setTimeout(() => navigate('/subscriptions'), 1200);
            } else {
                setMessage({ type: 'err', text: data.message || 'Could not create subscription.' });
            }
        } catch (e) {
            setMessage({ type: 'err', text: 'Could not reach the server.' });
        } finally {
            setSubmitting(false);
        }
    };

    // ---- styles ----
    const wrap = { maxWidth: '620px', margin: '0 auto', padding: '32px 20px 80px' };
    const label = { display: 'block', fontWeight: 600, fontSize: '14px', margin: '22px 0 8px', color: '#333' };
    const input = { width: '100%', padding: '11px 13px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };
    const modeCard = (active) => ({
        flex: 1, padding: '16px', borderRadius: '10px', cursor: 'pointer',
        border: active ? '2px solid #e23744' : '2px solid #eee',
        background: active ? '#fff5f5' : '#fff'
    });
    const checkRow = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0' };
    const btn = {
        width: '100%', padding: '14px', background: '#e23744', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600,
        cursor: submitting ? 'not-allowed' : 'pointer', marginTop: '28px',
        opacity: submitting ? 0.6 : 1
    };

    return (
        <div style={wrap}>
            <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: '#e23744', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                ← Back to home
            </button>

            <h1 style={{ fontSize: '26px', margin: '18px 0 6px' }}>🍛 Set Up Daily Thali</h1>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                We'll place the order automatically. You'll get a notification to pay each
                time — nothing is charged without your approval.
            </p>

            {/* Mode picker */}
            <label style={label}>How should we choose?</label>
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={modeCard(mode === 'cheapest')} onClick={() => setMode('cheapest')}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>💰 Cheapest</div>
                    <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>
                        Find the lowest-priced thali anywhere
                    </div>
                </div>
                <div style={modeCard(mode === 'fixed')} onClick={() => setMode('fixed')}>
                    <div style={{ fontWeight: 700, fontSize: '15px' }}>🏠 Same restaurant</div>
                    <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>
                        Always order from one place
                    </div>
                </div>
            </div>

            {/* Conditional: restaurant or price ceiling */}
            {mode === 'fixed' ? (
                <>
                    <label style={label}>Restaurant</label>
                    <select style={input} value={restaurantId} onChange={e => setRestaurantId(e.target.value)}>
                        <option value="">— choose a restaurant —</option>
                        {restaurants.map(r => (
                            <option key={r._id} value={r._id}>{r.Title}</option>
                        ))}
                    </select>
                    {restaurants.length === 0 && (
                        <small style={{ color: '#999' }}>Loading restaurants…</small>
                    )}
                </>
            ) : (
                <>
                    <label style={label}>Maximum price per thali</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="range" min="80" max="500" step="10"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <span style={{ fontWeight: 700, color: '#e23744', minWidth: '60px' }}>₹{maxPrice}</span>
                    </div>
                </>
            )}

            {/* Meal times */}
            <label style={label}>When should we order?</label>
            <div style={checkRow}>
                <input type="checkbox" checked={times.lunch} onChange={e => setTimes({ ...times, lunch: e.target.checked })} />
                <span>🌞 Lunch — 2:00 PM</span>
            </div>
            <div style={checkRow}>
                <input type="checkbox" checked={times.dinner} onChange={e => setTimes({ ...times, dinner: e.target.checked })} />
                <span>🌙 Dinner — 9:00 PM</span>
            </div>
            <div style={{ ...checkRow, gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Or a custom time:</span>
                <input
                    type="time"
                    value={customTime}
                    onChange={e => setCustomTime(e.target.value)}
                    style={{ ...input, width: 'auto', padding: '8px' }}
                />
            </div>

            {/* Address */}
            <label style={label}>Delivery address</label>
            <input
                style={input}
                placeholder="Street / flat / landmark"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input style={input} placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
                <input style={input} placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
            </div>

            {message && (
                <div style={{
                    marginTop: '20px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px',
                    background: message.type === 'ok' ? '#e6f6ea' : '#fdecea',
                    color: message.type === 'ok' ? '#1b7a35' : '#b3261e'
                }}>
                    {message.text}
                </div>
            )}

            <button style={btn} onClick={submit} disabled={submitting}>
                {submitting ? 'Setting up…' : 'Start daily thali'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                    onClick={() => navigate('/subscriptions')}
                    style={{ background: 'none', border: 'none', color: '#e23744', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                    View my existing daily orders →
                </button>
            </p>
        </div>
    );
};

export default CreateSubscription;