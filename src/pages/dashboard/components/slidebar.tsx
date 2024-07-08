import React from 'react';
import { FiMessageSquare } from 'react-icons/fi'; 

interface Conversation {
  id: number;
  user: string;
  lastMessage: string;
}

interface SidebarProps {
  conversations: Conversation[];
  onSelectChat: (conversation: Conversation) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, onSelectChat }) => {
  return (
    <div className="w-1/4 bg-gray-900 p-4 overflow-y-auto border-r border-gray-300">
      <h2 className="text-lg font-bold mb-4 text-green-600 flex items-center">
        <FiMessageSquare className="mr-2" /> Conversas
      </h2>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="p-4 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 flex items-start"
          onClick={() => onSelectChat(conversation)}
        >
          <div className="flex-shrink-0 mr-3">
            <FiMessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-600">{conversation.user}</h3>
            <p className="text-xs text-gray-600">Última mensagem : {conversation.lastMessage}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
