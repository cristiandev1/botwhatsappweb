import React, { useState, ChangeEvent, FormEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-2 bg-gray-100 border-t border-gray-300">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        className="flex-1 p-2 border border-gray-300 rounded-l-lg text-black"
        placeholder="Digite sua mensagem..."
      />
      <button type="submit" className="p-2 bg-green-600 text-white rounded-r-lg">Enviar</button>
    </form>
  );
};

export default MessageInput;
