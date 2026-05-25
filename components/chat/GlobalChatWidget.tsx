import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, orderBy, serverTimestamp, getDocs, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useMockDB } from '../../contexts/MockDatabaseContext';
import { ChatBubbleLeftRightIcon, XIcon, PlusIcon, PaperAirplaneIcon, PhotoIcon, DocumentTextIcon, UserIcon, ArrowLeftIcon, UsersIcon } from '../icons';
import { Video, Mic, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { VideoCallInterface } from './VideoCallInterface';

export const GlobalChatWidget: React.FC = () => {
    const { currentUser } = useMockDB();
    const [chatUser, setChatUser] = useState<any>(null);

    useEffect(() => {
        if (currentUser) {
            setChatUser(currentUser);
            localStorage.setItem('rhive_chat_user', JSON.stringify(currentUser));
        } else {
            const saved = localStorage.getItem('rhive_chat_user');
            if (saved) {
                setChatUser(JSON.parse(saved));
            }
        }
    }, [currentUser]);

    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'list' | 'room' | 'new' | 'settings'>('list');
    const [activeChat, setActiveChat] = useState<any | null>(null);
    const [chats, setChats] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    
    // New Chat / Group State
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    
    // Message Input State
    const [messageText, setMessageText] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch all users
    useEffect(() => {
        if (!chatUser) return;
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(fetchedUsers);
        }, (error) => {
            console.error("Error fetching users:", error);
        });
        
        return () => unsubscribe();
    }, [chatUser]);

    // Fetch user's chats
    useEffect(() => {
        if (!chatUser || !chatUser.id) return;
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', chatUser.id)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedChats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a: any, b: any) => (b.updatedAt?.toMillis() || 0) - (a.updatedAt?.toMillis() || 0));
            setChats(fetchedChats);
        });
        return () => unsubscribe();
    }, [currentUser]);

    // Fetch messages for active chat
    useEffect(() => {
        if (!activeChat) return;
        const q = query(
            collection(db, 'chat_messages'),
            where('chatId', '==', activeChat.id)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a: any, b: any) => {
                    const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : Date.now();
                    const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : Date.now();
                    return timeA - timeB;
                });
            setMessages(fetchedMessages);
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }, (error) => {
            console.error("Error fetching messages:", error);
        });
        return () => unsubscribe();
    }, [activeChat]);

    const handleCreateChat = async () => {
        if (!chatUser || selectedUsers.length === 0) return;
        
        const isGroup = selectedUsers.length > 1 || groupName.trim() !== '';
        const participants = [chatUser.id, ...selectedUsers];

        // Check if direct chat already exists
        if (!isGroup) {
            const existingChat = chats.find(c => 
                c.type === 'direct' && 
                c.participants.length === 2 && 
                c.participants.includes(selectedUsers[0])
            );
            if (existingChat) {
                setActiveChat(existingChat);
                setView('room');
                setSelectedUsers([]);
                return;
            }
        }

        try {
            const chatData = {
                type: isGroup ? 'group' : 'direct',
                name: isGroup ? groupName : '',
                participants,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastMessage: 'Chat created'
            };
            const docRef = await addDoc(collection(db, 'chats'), chatData);
            setActiveChat({ id: docRef.id, ...chatData });
            setView('room');
            setSelectedUsers([]);
            setGroupName('');
        } catch (err) {
            console.error("Error creating chat:", err);
        }
    };

    const handleSendMessage = async (text: string, type: string = 'text', fileUrl: string = '', fileName: string = '') => {
        if ((!text.trim() && !fileUrl) || !activeChat || !chatUser) return;

        try {
            const msgData = {
                chatId: activeChat.id,
                senderId: chatUser.id,
                senderName: chatUser.name || 'User',
                text,
                type,
                fileUrl,
                fileName,
                timestamp: serverTimestamp()
            };
            await addDoc(collection(db, 'chat_messages'), msgData);
            await updateDoc(doc(db, 'chats', activeChat.id), {
                lastMessage: type === 'text' ? text : `Sent an ${type}`,
                updatedAt: serverTimestamp()
            });
            setMessageText('');
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const uploadFile = async (file: File) => {
        if (!activeChat || !chatUser) return;
        const type = file.type.startsWith('image/') ? 'image' : 'file';
        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Url = reader.result as string;
                await handleSendMessage('', type, base64Url, file.name);
                setUploading(false);
            };
            reader.onerror = () => {
                console.error("Failed to read file");
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error("Upload failed:", err);
            setUploading(false);
        }
    };

    const handleUpdateGroup = async () => {
        if (!activeChat) return;
        try {
            await updateDoc(doc(db, 'chats', activeChat.id), {
                name: groupName,
                participants: [chatUser.id, ...selectedUsers]
            });
            setActiveChat({ ...activeChat, name: groupName, participants: [chatUser.id, ...selectedUsers] });
            setView('room');
        } catch (err) {
            console.error("Failed to update group", err);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const getChatName = (chat: any) => {
        if (chat.type === 'group') return chat.name || 'Unnamed Group';
        const otherUserId = chat.participants.find((id: string) => id !== chatUser?.id);
        const otherUser = users.find(u => u.id === otherUserId);
        return otherUser ? otherUser.name : 'Unknown User';
    };

    if (!chatUser) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
            {isVideoCallActive && <VideoCallInterface onClose={() => setIsVideoCallActive(false)} />}
            
            {/* Main Chat Panel */}
            {isOpen && (
                <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-[0_0_40px_rgba(236,2,139,0.2)] w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    
                    {/* Header */}
                    <div className="bg-black/60 border-b border-gray-800 p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center text-white font-bold tracking-widest uppercase text-sm">
                            {(view === 'room' || view === 'new' || view === 'settings') && (
                                <button onClick={() => { if (view === 'settings') setView('room'); else { setView('list'); setActiveChat(null); } }} className="mr-3 text-gray-400 hover:text-white">
                                    <ArrowLeftIcon className="w-4 h-4" />
                                </button>
                            )}
                            {view === 'list' && <span>Messages</span>}
                            {view === 'new' && <span>New Chat</span>}
                            {view === 'settings' && <span>Group Settings</span>}
                            {view === 'room' && activeChat && <span className="truncate max-w-[180px]">{getChatName(activeChat)}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                            {view === 'list' && (
                                <button onClick={() => setView('new')} className="text-[#ec028b] hover:text-white transition-colors">
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            )}
                            {view === 'room' && activeChat?.type === 'group' && (
                                <button className="text-[#ec028b] hover:text-white transition-colors" title="Group Settings" onClick={() => { setView('settings'); setGroupName(activeChat.name || ''); setSelectedUsers(activeChat.participants.filter((id: string) => id !== chatUser.id)); }}>
                                    <UsersIcon className="w-4 h-4" />
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* View: Chat List */}
                    {view === 'list' && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 bg-black/30">
                            {chats.length === 0 ? (
                                <div className="text-center p-6 text-gray-500 text-sm mt-10">No messages yet. Start a new chat!</div>
                            ) : (
                                chats.map(chat => (
                                    <div 
                                        key={chat.id} 
                                        onClick={() => { setActiveChat(chat); setView('room'); }}
                                        className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shrink-0 group-hover:border-[#ec028b]">
                                            {chat.type === 'group' ? <UsersIcon className="w-5 h-5 text-gray-400" /> : <UserIcon className="w-5 h-5 text-gray-400" />}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-white text-sm font-bold truncate">{getChatName(chat)}</p>
                                            <p className="text-gray-400 text-xs truncate">{chat.lastMessage || '...'}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* View: New Chat */}
                    {view === 'new' && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col bg-black/30">
                            {selectedUsers.length > 1 && (
                                <input 
                                    type="text" 
                                    placeholder="Group Name (optional)" 
                                    value={groupName}
                                    onChange={e => setGroupName(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#ec028b] mb-4"
                                />
                            )}
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Select Users</p>
                            <div className="space-y-2 flex-1">
                                {users.filter(u => u.id !== chatUser.id).map(user => (
                                    <div 
                                        key={user.id} 
                                        onClick={() => toggleUserSelection(user.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-colors",
                                            selectedUsers.includes(user.id) ? "bg-[#ec028b]/10 border-[#ec028b]" : "bg-gray-800 border-gray-700 hover:border-gray-500"
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                                            {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" /> : <UserIcon className="w-4 h-4 text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{user.name || user.email}</p>
                                            <p className="text-gray-500 text-xs truncate">{user.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={handleCreateChat}
                                disabled={selectedUsers.length === 0}
                                className="mt-4 w-full bg-[#ec028b] hover:bg-pink-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(236,2,139,0.3)] disabled:shadow-none"
                            >
                                Start Chat
                            </button>
                        </div>
                    )}

                    {/* View: Group Settings */}
                    {view === 'settings' && activeChat && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col bg-black/30">
                            <input 
                                type="text" 
                                placeholder="Group Name" 
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#ec028b] mb-4"
                            />
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Group Members</p>
                            <div className="space-y-2 flex-1">
                                {users.filter(u => u.id !== chatUser.id).map(user => (
                                    <div 
                                        key={user.id} 
                                        onClick={() => toggleUserSelection(user.id)}
                                        className={cn(
                                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-colors",
                                            selectedUsers.includes(user.id) ? "bg-[#ec028b]/10 border-[#ec028b]" : "bg-gray-800 border-gray-700 hover:border-gray-500"
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                                            {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" /> : <UserIcon className="w-4 h-4 text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{user.name || user.email}</p>
                                            <p className="text-gray-500 text-xs truncate">{user.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={handleUpdateGroup}
                                className="mt-4 w-full bg-[#ec028b] hover:bg-pink-600 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(236,2,139,0.3)]"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}

                    {/* View: Chat Room */}
                    {view === 'room' && activeChat && (
                        <div 
                            className="flex-1 flex flex-col bg-black/30 overflow-hidden relative"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {isDragging && (
                                <div className="absolute inset-0 z-50 bg-[#ec028b]/20 border-2 border-dashed border-[#ec028b] flex items-center justify-center backdrop-blur-sm m-2 rounded-xl">
                                    <p className="text-[#ec028b] font-bold tracking-widest uppercase">Drop file to send</p>
                                </div>
                            )}
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {messages.map(msg => {
                                    const isMe = msg.senderId === chatUser.id;
                                    return (
                                        <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                            <p className="text-[10px] text-gray-500 mb-1">{isMe ? 'You' : msg.senderName}</p>
                                            <div className={cn(
                                                "max-w-[80%] rounded-xl p-3 text-sm",
                                                isMe ? "bg-[#ec028b] text-white rounded-br-none" : "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-none"
                                            )}>
                                                {msg.type === 'text' && <p className="break-words">{msg.text}</p>}
                                                {msg.type === 'image' && <img src={msg.fileUrl} alt="uploaded" className="rounded max-w-full h-auto cursor-pointer hover:opacity-90" onClick={() => window.open(msg.fileUrl, '_blank')} />}
                                                {msg.type === 'file' && <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-300 hover:underline"><DocumentTextIcon className="w-4 h-4 mr-2" /> {msg.fileName}</a>}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 bg-gray-900 border-t border-gray-800">
                                {uploading && <div className="text-xs text-[#ec028b] mb-2 animate-pulse">Uploading...</div>}
                                <div className="flex items-center gap-2">
                                    {/* Action Buttons */}
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => setIsVideoCallActive(true)} className="p-2 text-gray-400 hover:text-[#ec028b] transition-colors rounded-full hover:bg-gray-800" title="Video Call">
                                            <Video className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => alert('Audio messages coming soon!')} className="p-2 text-gray-400 hover:text-[#ec028b] transition-colors rounded-full hover:bg-gray-800" title="Send Audio">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <input 
                                        type="text" 
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSendMessage(messageText)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-black border border-gray-700 text-white rounded-full px-4 py-2 text-sm outline-none focus:border-[#ec028b] transition-colors"
                                    />
                                    <button 
                                        onClick={() => handleSendMessage(messageText)}
                                        disabled={!messageText.trim() && !uploading}
                                        className="p-2 bg-[#ec028b] text-white rounded-full hover:bg-pink-600 disabled:bg-gray-800 disabled:text-gray-500 transition-colors shrink-0 shadow-[0_0_10px_rgba(236,2,139,0.3)] disabled:shadow-none flex items-center justify-center"
                                    >
                                        <Send className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#ec028b] hover:bg-pink-600 rounded-full shadow-[0_0_20px_rgba(236,2,139,0.5)] flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90"
            >
                {isOpen ? <XIcon className="w-6 h-6" /> : <ChatBubbleLeftRightIcon className="w-7 h-7" />}
            </button>
        </div>
    );
};
