import React, { useState } from 'react';
import { CachingType } from './types';
import ChatColumn from './components/ChatColumn';
import Modal from './components/Modal';
import { GithubIcon, LinkedinIcon, XIcon } from './components/icons';

const App: React.FC = () => {
  const [modalType, setModalType] = useState<CachingType | null>(null);

  const openModal = (type: CachingType) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#14181f] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex flex-col items-center justify-center whitespace-nowrap border-b border-solid border-b-[#293142] px-10 py-3 text-white text-center">
          <h1 className="text-2xl font-bold leading-tight tracking-[-0.015em]">RAG Caching Comparison</h1>
          <p className="text-base font-normal leading-normal">Comparing Exact vs. Semantic Caching with Gemini</p>
        </header>
        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1 justify-center py-5 px-4 md:px-6 lg:px-8 gap-4 md:gap-6 lg:gap-8 items-stretch mx-auto">
          <div className="layout-content-container flex flex-col w-full max-w-[500px]">
            <div className="flex flex-1 flex-col gap-1 p-4">
              {/* ChatColumn for Exact Caching */}
              <ChatColumn
                cachingType={CachingType.Exact}
                onOpenDescription={() => openModal(CachingType.Exact)}
              />
            </div>
          </div>
          <div className="layout-content-container flex flex-col w-full max-w-[500px]">
            <div className="flex flex-1 flex-col gap-1 p-4">
              {/* ChatColumn for Semantic Caching */}
              <ChatColumn
                cachingType={CachingType.Semantic}
                onOpenDescription={() => openModal(CachingType.Semantic)}
              />
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="flex flex-col items-center justify-center py-4 border-t border-solid border-t-[#293142] text-gray-400 text-sm mt-8">
          <div className="flex gap-4 mb-2">
            <a href="https://github.com/YoSoyKevin" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubIcon className="h-7 w-7 hover:text-[#3B82F6] transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/kevin-shimizu-dev/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedinIcon className="h-7 w-7 hover:text-[#3B82F6] transition-colors" />
            </a>
            <span aria-label="X / Twitter">
              <XIcon className="h-7 w-7 text-[#9ba7c0]" />
            </span>
          </div>
          <p className="text-[#9ba7c0] text-base font-normal leading-normal">
            © {new Date().getFullYear()} RAG Caching Comparator. All rights reserved.
          </p>
        </footer>
      </div>
      {/* Modals */}
      <Modal
        isOpen={modalType === CachingType.Exact}
        onClose={closeModal}
        title="🔎 ¿Qué es Exact Caching?"
      >
        <div className="space-y-4 pt-0 pb-10 px-6 md:px-16">
          <div className="text-gray-300 space-y-4">
            <p className="mb-4">El exact caching guarda respuestas y las reutiliza <b>solo si la pregunta es exactamente igual</b> a una que ya fue respondida antes.</p>
            <hr className="my-4 border-gray-600" />
            <h3 className="text-lg font-semibold mt-6 mb-2">📌 ¿Cómo funciona?</h3>
            <p className="mb-4">El sistema compara el texto de tu pregunta <b>caracter por caracter</b>.<br />Si encuentra una coincidencia exacta, usa la misma respuesta inmediatamente.</p>
            <h3 className="text-lg font-semibold mt-6 mb-2">✅ ¿Cuándo se activa?</h3>
            <p className="mb-4">Solo cuando el prompt que escribes <b>es idéntico en cada letra, espacio y símbolo</b> al que ya está guardado.</p>
            <h3 className="text-lg font-semibold mt-6 mb-2">📍Ejemplo real:</h3>
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-gray-700/50 text-sm mb-4">
              <b>Pregunta cacheada:</b><br />
              <i>¿Cuál es la capital de Francia?</i><br /><br />
              <b>Nueva pregunta:</b><br />
              <i>¿Cual es la capital de Francia?</i> &larr; Sin tilde
            </blockquote>
            <p className="mb-4">Aunque parecen iguales, <b>no son idénticas</b>, así que el sistema genera una nueva respuesta.</p>
            <hr className="my-4 border-gray-600" />
            <h3 className="text-lg font-semibold mt-6 mb-2">⚠️ ¿Qué pasa si hay diferencias mínimas?</h3>
            <p>Si cambias una letra, un signo o un espacio, <b>ya no es un match</b> y se considera una pregunta nueva.</p>
          </div>
          <img src="/images/exact_caching.png" alt="Diagram of exact caching flow" className="rounded-lg mx-auto block w-full max-w-xl h-auto mt-8" />
        </div>
      </Modal>
      <Modal
        isOpen={modalType === CachingType.Semantic}
        onClose={closeModal}
        title="🧠 ¿Qué es Semantic Caching?">
        <div className="space-y-4 pt-0 pb-10 px-6 md:px-16">
          <div className="text-gray-300 space-y-4">
            <p className="mb-4">El cache semántico ayuda a responder más rápido cuando haces preguntas parecidas a otras que ya fueron respondidas antes.</p>
            <hr className="my-4 border-gray-600" />
            <h3 className="text-lg font-semibold mt-6 mb-2">📌 ¿Cómo funciona?</h3>
            <p className="mb-4">En lugar de buscar preguntas exactamente iguales, el sistema entiende el <b>significado</b> de lo que preguntas.<br />Si ya se respondió algo muy similar, se reutiliza esa respuesta al instante.</p>
            <h3 className="text-lg font-semibold mt-6 mb-2">✅ ¿Cuándo se activa?</h3>
            <p className="mb-4">Cuando haces una pregunta que <b>suena diferente, pero quiere decir lo mismo</b> que otra ya respondida.<br />Si el sistema detecta esa similitud, usa la misma respuesta para ahorrar tiempo y recursos.</p>
            <h3 className="text-lg font-semibold mt-6 mb-2">📍Ejemplo real:</h3>
            <blockquote className="border-l-4 border-blue-400 pl-4 py-2 bg-gray-700/50 text-sm mb-4">
              <b>Pregunta respondida antes:</b><br />
              <i>¿Cuál es la capital de Francia?</i><br /><br />
              <b>Nueva pregunta:</b><br />
              <i>¿Me puedes decir la capital de Francia?</i>
            </blockquote>
            <p className="mb-4">Aunque no son iguales, el sistema entiende que <b>el significado es el mismo</b>, y reutiliza la respuesta.</p>
            <hr className="my-4 border-gray-600" />
            <h3 className="text-lg font-semibold mt-6 mb-2">⚠️ ¿Y si la pregunta es muy distinta?</h3>
            <p>Si la nueva pregunta <b>no se parece lo suficiente</b>, el sistema la trata como nueva y genera una respuesta desde cero.</p>
          </div>
          <img src="/images/semantic_caching.png" alt="Diagram of semantic caching flow" className="rounded-lg mx-auto block w-full max-w-xl h-auto mt-8" />
        </div>
      </Modal>
    </div>
  );
};

export default App;