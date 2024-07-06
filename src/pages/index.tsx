import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaWhatsapp } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(50);

  useEffect(() => {
    let timer;
    if (qrCode) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.reload();
            return 50;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [qrCode]);

  const fetchQrCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3002/api/whatsapp/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.qrCode && data.sessionId) {
        setQrCode(data.qrCode);
        setSessionId(data.sessionId);
      } else {
        throw new Error('Invalid response structure');
      }

    } catch (error) {
      console.error('Error fetching the QR Code:', error);
      alert('Erro ao obter o QR Code. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length <= 13) {
      setPhoneNumber(value);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const response = await fetch('http://127.0.0.1:3002/api/whatsapp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, sessionId }),
      });
      const data = await response.json();

      setVerifying(false);

      if (response.ok) {
        localStorage.setItem('jwtToken', data.token);
        alert('Redirecionar para dashboard');
        console.log(data.token);
        //router.push('/dashboard');
      } else {
        alert(data.message || 'Erro na verificação');
      }
    } catch (error) {
      console.error('Error verifying the QR Code:', error);
      alert('Erro ao tentar verificar o QR Code. Tente novamente.');
      setVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex max-w-4xl w-full text-white">
        <div className="flex flex-col justify-center items-center w-1/2 border-r border-gray-700 p-4">
          <FaWhatsapp className="text-green-500 mb-4" size={60} />
          <h1 className="text-3xl font-semibold mb-4">Bem-vindo!</h1>
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder="Exemplo: 554599999999"
            className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-black"
          />
          <button
            onClick={fetchQrCode}
            disabled={phoneNumber.length !== 13 || loading}
            className={`px-6 py-2 rounded-lg text-white w-full flex items-center justify-center ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {loading ? <AiOutlineLoading3Quarters className="animate-spin" size={24} /> : 'Obter QR Code'}
          </button>
        </div>
        <div className="flex flex-col justify-center items-center w-1/2 p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center mt-4">
              <AiOutlineLoading3Quarters className="animate-spin text-green-500" size={40} />
              <h1 className="text-lg font-semibold mt-2">Aguardando QR Code...</h1>
            </div>
          )}
          {qrCode ? (
            <div className="flex flex-col items-center">
              <Image src={qrCode} alt="QR Code" width={256} height={256} />
              <p className="mt-2 text-gray-300">O QR Code deve ser lido pelo WhatsApp, não pela câmera normal.</p>
              <p className="mt-2 text-red-500">O QR Code expira em {timeLeft} segundos</p>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="mt-4 px-6 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 flex items-center justify-center"
              >
                {verifying ? <AiOutlineLoading3Quarters className="animate-spin" size={24} /> : 'Já li o QR Code'}
              </button>
            </div>
          ) : (
            <ul className="mt-4 text-left text-gray-300">
              <li className="mb-2">1. Abra o WhatsApp no seu telefone</li>
              <li className="mb-2">2. Toque em Menu ou Configurações e selecione WhatsApp Web</li>
              <li className="mb-2">3. Aponte seu telefone para esta tela para capturar o código</li>
            </ul>
          )}
        </div>
      </div>
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
