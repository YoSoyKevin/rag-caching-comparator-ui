import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CachingType, Message } from '../types';
import { getBotResponse } from '../services/chatApiService';
import { ClockIcon, SendIcon } from './icons';

interface ChatColumnProps {
  cachingType: CachingType;
  onOpenDescription: () => void;
}

const ChatColumn: React.FC<ChatColumnProps> = ({ cachingType, onOpenDescription }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ time: number; cacheHit: boolean } | null>(null);
  const cache = useRef(new Map<string, string>());
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const title = cachingType === CachingType.Exact ? 'Exact Caching' : 'Semantic Caching';

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (messages.length === 0) {
        const initialBotMessage: Message = {
            id: crypto.randomUUID(),
            from: 'bot',
            text: `Este es el chat de ${title}. Haz una pregunta para empezar.`
        };
        setMessages([initialBotMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      from: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    let botResponseText: string = '';
    let cacheHit = false;

    if (cachingType === CachingType.Exact) {
      if (cache.current.has(inputValue)) {
        botResponseText = cache.current.get(inputValue)!;
        cacheHit = true;
      }
    }
    
    if (botResponseText === '') {
      const response = await getBotResponse(inputValue, cachingType === CachingType.Exact ? 'exact' : 'semantic');
      botResponseText = response.result;
      cache.current.set(inputValue, botResponseText);
      setLastResult({ time: response.elapsed, cacheHit: response.cache_status === 'hit' });
    } else {
      setLastResult({ time: 0, cacheHit: true });
    }
    
    const botMessage: Message = {
      id: crypto.randomUUID(),
      text: botResponseText,
      from: 'bot',
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);

  }, [inputValue, isLoading, cachingType]);

  return (
    <div className="bg-[#1F2937] rounded-lg p-4 flex flex-col h-[75vh] mb-6 md:mb-0">
      <div className="pb-4 border-b border-gray-700">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <button
            onClick={onOpenDescription}
            className="text-sm text-[#3B82F6] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 rounded-md px-2 py-1"
            >
            ¿Qué es {title}?
            </button>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto py-4 pr-2 space-y-4"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${msg.from === 'user' ? 'bg-[#3B82F6] text-white' : 'bg-gray-700 text-[#E5E7EB]'}`}>
              <p className="text-base">{msg.text}</p>
            </div>
          </div>
        ))}
         {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-lg px-4 py-3 flex items-center space-x-2">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
      </div>
      
      <div className="pt-4 border-t border-gray-700">
        <div className="min-h-[36px] mb-2 px-1 flex items-center">
            {lastResult && (
              <div className="flex items-center justify-between w-full text-sm text-gray-400 animate-fade-in">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    <span>Time: {lastResult.time} ms</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${lastResult.cacheHit ? 'bg-green-600' : 'bg-red-600'}`}>
                    Match: {lastResult.cacheHit ? 'Sí' : 'No'}
                  </span>
              </div>
            )}
        </div>
        <form onSubmit={handleSubmit}>
         <label htmlFor={`chat-input-${cachingType}`} className="sr-only">Pregunta aquí…</label>
         <div className="flex items-center gap-2">
            <input
               id={`chat-input-${cachingType}`}
               type="text"
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               placeholder="Pregunta aquí…"
               disabled={isLoading}
               className="w-full bg-gray-700 text-[#E5E7EB] placeholder-gray-400 rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition"
            />
            <button
               type="submit"
               disabled={isLoading}
               className="bg-[#3B82F6] text-white p-2 rounded-lg hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#3B82F6] disabled:bg-gray-600 disabled:cursor-not-allowed transition-all"
               aria-label="Send message"
            >
               <SendIcon className="h-5 w-5"/>
            </button>
         </div>
       </form>
      </div>
    </div>
  );
};

export default ChatColumn;