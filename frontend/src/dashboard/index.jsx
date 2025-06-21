import React, { useEffect, useState } from 'react';
import './styles.css';
import Cookies from "js-cookie"
import { useActionData, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SendMoneyModal = ({ contact, onClose, onSend, refreshData }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [money, setMoney] = useState("")
    const [show, setshow] = useState(false)
    console.log(contact.Id)
    const handleSend = async () => {
        const response = await axios.post("https://paytm-t9yo.onrender.com/user/v1/send-money", {
            senderid: contact.Id, sendmoney: amount
        }, {
            headers: {
                token: Cookies.get("jwt_token")
            }
        })
        setMoney(response.data.msg)
        setshow(!show)
        console.log(response.data)
        // Call refreshData after successful transfer
        refreshData();
        // Close the modal after a short delay
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="send-money-modal">
                <div className="modal-header">
                    <h3>Send Money to {contact.name}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="contact-info-modal">
                        <div className="contact-avatar">{ }</div>
                        <div>
                            <h4>{contact.username}</h4>
                            <p>{contact.phone}</p>
                        </div>
                    </div>
                    <div className="amount-input">
                        <span className="currency-symbol">₹</span>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                        />
                    </div>
                    <div className="note-input">
                        <input
                            type="text"
                            placeholder="Add a note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <button
                        className="send-confirm-btn"
                        onClick={handleSend}
                        disabled={!amount || parseFloat(amount) <= 0}
                    >
                        Send ₹{amount || '0'}
                    </button>
                    {show && <p>{money}</p>}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const nav = useNavigate()
    const name = Cookies.get("user")
    const [selectedContact, setSelectedContact] = useState(null);
    const [contacts, setContacts] = useState([])
    const [amout, setAmount] = useState("")
    const [isLoadingBalance, setIsLoadingBalance] = useState(true);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const onclickLogin = () => {
        Cookies.remove("jwt_token")
        Cookies.remove("user")
        nav("/")
    }

    const handleSendMoney = (contact, amount, note) => {
        // Here you would typically make an API call to process the transaction
        console.log('Sending money:', { contact, amount, note });
        // For now, we'll just show an alert
        alert(`Successfully sent ₹${amount} to ${contact.name}`);
    };

    // Sample contacts data (in real app, this would come from an API)
    const onCLickSendmoney = (contact) => {
        setSelectedContact(contact)
        console.log(contact.Id)
    }
    const fetchData = async () => {
        try {
            setIsLoadingContacts(true);
            setIsLoadingBalance(true);
            setIsLoadingTransactions(true);

            const [usersResponse, balanceResponse, historyResponse] = await Promise.all([
                axios.get("https://paytm-t9yo.onrender.com/user/v1/get-users", {
                    headers: {
                        token: Cookies.get("jwt_token")
                    }
                }),
                axios.get("https://paytm-t9yo.onrender.com/user/v1/check-balance", {
                    headers: {
                        token: Cookies.get("jwt_token")
                    }
                }),
                axios.get("https://paytm-t9yo.onrender.com/user/v1/get-history", {
                    headers: {
                        token: Cookies.get("jwt_token")
                    }
                })
            ]);

            setContacts(usersResponse.data.userlist);
            setAmount(balanceResponse.data.Bal);
            setTransactions(historyResponse.data.history);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoadingContacts(false);
            setIsLoadingBalance(false);
            setIsLoadingTransactions(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="dashboard-container">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="location">
                    <span className="location-icon">📍</span>
                    <span>Mumbai, India</span>
                </div>
                <div className="top-actions">
                    <button className="scan-btn">
                        <span className="scan-icon">📷</span>
                        Scan
                    </button>
                    <div className="profile-section">
                        <div className="profile-icon">{name[0]}</div>
                        <span className="profile-name">{name}</span>
                    </div>
                    <button className="signout-btn" onClick={onclickLogin}>
                        <span className="signout-icon">🚪</span>
                        Sign Out
                    </button>
                    <div className="notification-bell">🔔</div>
                </div>
            </div>

            {/* Main Content */}
            <main className="main-content">
                {/* Balance Card */}
                <div className="balance-card">
                    <div className="balance-header">
                        <div className="balance-info">
                            <h2>Available Balance</h2>
                            {isLoadingBalance ? (
                                <div className="loading-skeleton">Loading...</div>
                            ) : (
                                <h1>₹ {amout}</h1>
                            )}
                        </div>
                        <div className="wallet-icon">💳</div>
                    </div>
                    <div className="balance-actions">
                        <button className="action-btn">
                            <span className="action-icon">➕</span>
                            Add Money
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">↗️</span>
                            Send Money
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">💸</span>
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Contacts Section */}
                <div className="contacts-section">
                    <div className="section-header">
                        <h3>Send Money to Contacts</h3>
                        <button className="view-all">View All</button>
                    </div>
                    <div className="contacts-search">
                        <input type="text" placeholder="Search contacts..." />
                        <span className="search-icon">🔍</span>
                    </div>
                    <div className="contacts-grid">
                        {isLoadingContacts ? (
                            // Loading skeleton for contacts
                            Array(4).fill().map((_, index) => (
                                <div key={index} className="contact-card loading">
                                    <div className="loading-skeleton">Loading...</div>
                                </div>
                            ))
                        ) : (
                            contacts.map(contact => (
                                <div key={contact.id} className="contact-card">
                                    <div className="profile-icon">{contact.username[0]}</div>
                                    <div className="contact-info">
                                        <h4>{contact.username}</h4>
                                    </div>
                                    <button
                                        className="send-money-btn"
                                        onClick={() => onCLickSendmoney(contact)}
                                    >
                                        <span className="send-icon">↗️</span>
                                        Send
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Services */}
                <div className="services-section">
                    <div className="section-header">
                        <h3>Quick Services</h3>
                        <button className="view-all">View All</button>
                    </div>
                    <div className="services-grid">
                        <div className="service-item">
                            <div className="service-icon mobile">📱</div>
                            <span>Mobile</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon electricity">💡</div>
                            <span>Electricity</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon bus">🚌</div>
                            <span>Bus</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon movie">🎬</div>
                            <span>Movies</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon shop">🏪</div>
                            <span>Shop</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon invest">📈</div>
                            <span>Invest</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon games">🎮</div>
                            <span>Games</span>
                        </div>
                        <div className="service-item">
                            <div className="service-icon more">➕</div>
                            <span>More</span>
                        </div>
                    </div>
                </div>

                {/* Offers Section */}
                <div className="offers-section">
                    <div className="section-header">
                        <h3>Offers for You</h3>
                        <button className="view-all">View All</button>
                    </div>
                    <div className="offers-slider">
                        <div className="offer-card">
                            <div className="offer-content">
                                <div className="offer-tag">50% OFF</div>
                                <h4>First Movie Ticket</h4>
                                <p>Get 50% cashback on your first movie ticket booking</p>
                                <button className="offer-btn">Book Now</button>
                            </div>
                            <div className="offer-image">🎬</div>
                        </div>
                        <div className="offer-card">
                            <div className="offer-content">
                                <div className="offer-tag">₹100 OFF</div>
                                <h4>Electricity Bill</h4>
                                <p>Pay your electricity bill and get ₹100 instant cashback</p>
                                <button className="offer-btn">Pay Now</button>
                            </div>
                            <div className="offer-image">⚡</div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="transactions-section">
                    <div className="section-header">
                        <h3>Recent Transactions</h3>
                        <button className="view-all">View All</button>
                    </div>
                    <div className="transactions-list">
                        {isLoadingTransactions ? (
                            // Loading skeleton for transactions
                            Array(3).fill().map((_, index) => (
                                <div key={index} className="transaction-item loading">
                                    <div className="loading-skeleton" style={{ width: '50px', height: '50px', borderRadius: '15px' }}></div>
                                    <div className="transaction-details" style={{ flex: 1, marginLeft: '20px' }}>
                                        <div className="loading-skeleton" style={{ width: '60%', height: '20px' }}></div>
                                        <div className="loading-skeleton" style={{ width: '40%', height: '16px', marginTop: '6px' }}></div>
                                    </div>
                                    <div className="loading-skeleton" style={{ width: '80px', height: '24px' }}></div>
                                </div>
                            ))
                        ) : transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <div key={transaction.id} className="transaction-item">
                                    <div className={`transaction-icon ${transaction.type === 'sent' ? 'money-transfer' : 'money-received'}`}>
                                        {transaction.type === 'sent' ? '💸' : '💰'}
                                    </div>
                                    <div className="transaction-details">
                                        <h4>
                                            {transaction.type === 'sent'
                                                ? `Sent to ${transaction.recivername}`
                                                : `Received from ${transaction.sendername}`
                                            }
                                        </h4>
                                        <p>Amount: ₹{transaction.moneysent}</p>
                                    </div>
                                    <div className={`transaction-amount ${transaction.type === 'sent' ? 'debit' : 'credit'}`}>
                                        {transaction.type === 'sent' ? '-' : '+'}₹{transaction.moneysent}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-transactions">
                                <p>No transactions yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Send Money Modal */}
            {selectedContact && (
                <SendMoneyModal
                    contact={selectedContact}
                    onClose={() => setSelectedContact(null)}
                    onSend={handleSendMoney}
                    refreshData={fetchData}
                />
            )}
        </div>
    );
};

export default Dashboard;
