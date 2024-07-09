import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FiSend, FiZap, FiUser, FiUserCheck } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface Chat {
  id: number;
  user: string;
}

interface ChatWindowProps {
  chat: Chat | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [suggestedResponse, setSuggestedResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessageId, setLoadingMessageId] = useState<number | null>(null);

  useEffect(() => {
    if (chat) {
      fetchMessages(chat.id);
    }
  }, [chat]);

  const fetchMessages = async (chatId: number) => {
    const fetchedMessages: Message[] = [
      { id: 1, text: 'Hello', sender: 'User 1' },
      { id: 2, text: 'Hi', sender: 'Me' },
    ];
    setMessages(fetchedMessages);
  };

  const sendMessage = (message: string) => {
    const newMessage: Message = { id: messages.length + 1, text: message, sender: 'Me' };
    setMessages([...messages, newMessage]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const suggestResponseForMessage = async (messageId: number, messageText: string) => {
    if (!messageText.trim()) return;

    const mockResponse = `Resposta sugerida para: "${messageText}"`;

    setLoading(true);
    setLoadingMessageId(messageId);
    setTimeout(() => {
      setSuggestedResponse(mockResponse);
      setLoading(false);
      setLoadingMessageId(null);
    }, 2000);
  };

  const acceptSuggestedResponse = () => {
    sendMessage(suggestedResponse);
    setSuggestedResponse('');
  };

  const rejectSuggestedResponse = () => {
    setSuggestedResponse('');
  };

  if (!chat) {
    return (
      <div className="w-3/4 flex flex-col p-4 bg-gray-800 text-white justify-center items-center">
        <h2 className="text-lg font-bold">Selecione uma conversa para começar</h2>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex flex-col bg-gray-50">
      <h2 className="text-lg font-bold mb-4 text-green-600 p-4">{chat.user}</h2>
      <div className="flex-1 bg-white p-4 rounded-lg overflow-y-auto border border-gray-300">
        {messages.map((message) => (
          <div key={message.id} className={`p-2 my-2 rounded-lg flex items-center ${message.sender === 'Me' ? 'bg-green-200 self-end text-gray-600' : 'bg-gray-100 text-black'}`}>
            {message.sender === 'Me' ? (
              <>
                <FiUserCheck className="mr-2 text-green-600" />
                <p>{message.text}</p>
              </>
            ) : (
              <>
                <FiUser className="mr-2 text-blue-600" />
                <p className="flex-1">{message.text}</p>
                <button
                  className="ml-2 p-1 bg-indigo-500 text-white rounded-full flex items-center justify-center transition duration-300 ease-in-out transform hover:bg-indigo-600 hover:scale-105"
                  onClick={() => suggestResponseForMessage(message.id, message.text)}
                  title="Sugerir resposta com I.A."
                >
                  {loading && loadingMessageId === message.id ? (
                    <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiZap className="w-4 h-4" />
                  )}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      {suggestedResponse && (
        <div className="p-4 bg-blue-100 border border-indigo-300 rounded-lg mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-indigo-600">Sugestão de Resposta:</h3>
            <p className="text-sm text-indigo-700">{suggestedResponse}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={acceptSuggestedResponse} className="p-2 bg-green-600 text-white rounded-lg">Aceitar</button>
            <button onClick={rejectSuggestedResponse} className="p-2 bg-red-700 text-white rounded-lg">Rejeitar</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex p-4">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg text-black"
          placeholder="Digite sua mensagem..."
        />
        <button
          type="submit"
          title="Enviar mensagem"
          className="p-2 bg-green-600 text-white rounded-r-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
