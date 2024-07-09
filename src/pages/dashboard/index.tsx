import React, { useState, useEffect } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import Sidebar from './components/slidebar';
import ChatWindow from './components/chatwindow';

interface Conversation {
  id: number;
  user: string;
  lastMessage: string;
  lastMessageTime: string;
}

const Index: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      //window.location.href = '../';
      fetchConversations();
      setLoading(false);
    } else {
      fetchConversations();
      setLoading(false);
    }
  }, []);

  const fetchConversations = async () => {
    const fetchedConversations: Conversation[] = [
      { id: 1, user: 'Pedro Rangel', lastMessage: 'Olá, como vai voce?', lastMessageTime: '12:00' },
      { id: 2, user: 'Bruna Cardoso', lastMessage: 'Oi, voces sao da clinica x ?', lastMessageTime: '12:00' },
    ];
    setConversations(fetchedConversations);
  };

  const selectChat = (chat: Conversation) => {
    setSelectedChat(chat);
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-lg font-bold text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar conversations={conversations} onSelectChat={selectChat} />
      {selectedChat ? (
        <ChatWindow chat={selectedChat} />
      ) : (
        <div className="w-3/4 flex flex-col p-4 bg-gray-50 justify-center items-center">
          <FiMessageSquare className="text-gray-600 w-16 h-16 mb-4" />
          <h2 className="text-lg font-bold text-gray-600">Selecione uma conversa para começar</h2>
          <p className="text-gray-500">Escolha uma das conversas ao lado para visualizar as mensagens</p>
        </div>
      )}
    </div>
  );
};

export default Index;
