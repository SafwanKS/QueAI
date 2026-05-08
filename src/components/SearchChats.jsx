import React, { useState, useEffect } from 'react';
import '../css/SearchChats.css';
import { useNavigate } from 'react-router';

const SearchChats = ({
    recentsChats,
    setOpenedChatID,
    shouldSaveChat,
    setChatMessages,
    setShowSearchChats
}) => {

    const navigate = useNavigate()

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setShowSearchChats(false)
            }
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [])

    return (
        <div className="searchChatsContainer">
            <div className="searchChats">
                <div className="searchChatsHeader">
                    <span className="material-symbols-outlined">search</span>
                    <input autoFocus type="text" placeholder="Search Chats" />
                    <div className="gap"></div>
                    <span className="material-symbols-outlined close" onClick={() => {
                        setShowSearchChats(false)
                    }}>close</span>
                </div>
                <div className="searchChatsList">
                    {
                        recentsChats.map((chat) => (
                            <div key={chat.id} className="searchChatsListItem" onClick={() => {
                                setOpenedChatID(chat.id)
                                shouldSaveChat.current = false
                                setChatMessages(chat)
                                navigate(`/chat/${chat.id}`)
                                setShowSearchChats(false)
                            }}>
                                <span className="material-symbols-outlined">chat_bubble</span>
                                <p>{chat.title}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default SearchChats;