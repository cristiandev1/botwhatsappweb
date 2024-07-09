import React from 'react';
import { FiMessageSquare, FiMessageCircle, FiClock, FiLogOut } from 'react-icons/fi';

interface Conversation {
  id: number;
  user: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface SidebarProps {
  conversations: Conversation[];
  onSelectChat: (conversation: Conversation) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, onSelectChat }) => {
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '../';
  };

  return (
    <div className="w-1/4 bg-gray-900 p-4 flex flex-col border-r border-gray-300 h-screen">
      <h2 className="text-lg font-bold mb-4 text-green-600 flex items-center">
        <FiMessageCircle className="mr-2" /> Conversas
      </h2>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-4 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-start"
            onClick={() => onSelectChat(conversation)}
          >
            <div className="flex-shrink-0 mr-3">
              <FiMessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-600">{conversation.user}</h3>
              <p className="text-xs text-gray-600">{conversation.lastMessage}</p>
            </div>
            <div className="flex-shrink-0 text-gray-500 text-xs flex items-center">
              <FiClock className="mr-1" />
              {conversation.lastMessageTime}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 p-2 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700"
      >
        <FiLogOut className="w-5 h-5 mr-2" />
        Sair
      </button>
    </div>
  );
};

export default Sidebar;
