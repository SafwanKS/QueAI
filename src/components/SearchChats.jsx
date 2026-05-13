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

    const [searchInput, setSearchInput] = useState("")

    const filteredChats = recentsChats.filter((chat) => chat.title.toLowerCase().includes(searchInput.toLowerCase()))

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
                    <input autoFocus type="text" placeholder="Search Chats" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <div className="gap"></div>
                    <span className="material-symbols-outlined close" onClick={() => {
                        setShowSearchChats(false)
                    }}>close</span>
                </div>
                <div className="searchChatsList">
                    {
                        filteredChats.length > 0 ?
                            filteredChats.map((chat) => (
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
                            : <div>
                                No results found
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default SearchChats;