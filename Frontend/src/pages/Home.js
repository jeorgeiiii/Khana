import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const fetchOrders = async () => {
        try {
            // ONLY CHANGE THIS LINE - add /api/v1/
            const url = "http://localhost:5000/api/v1/order";
            const headers = {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            console.log('Orders result:', result);
            
            if (Array.isArray(result)) {
                setOrders(result);
            } else if (result.orders && Array.isArray(result.orders)) {
                setOrders(result.orders);
            } else if (result.data && Array.isArray(result.data)) {
                setOrders(result.data);
            } else {
                setOrders([]);
                console.warn('Unexpected response format:', result);
            }
        } catch (err) {
            handleError(err);
            setOrders([]);
        }
    }
    
    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div>
            <h1>Welcome {loggedInUser}</h1>
            <button onClick={handleLogout}>Logout</button>
            <div>
                {
                    orders && orders.length > 0 ? (
                        orders.map((item, index) => (
                            <ul key={index}>
                                <span>Order #{item.orderNumber || item._id} : ${item.totalAmount} - {item.status}</span>
                            </ul>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Home