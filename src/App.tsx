import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Timer } from 'lucide-react';

function App() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    totalMinutes: 0
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Calcular tempo desde 20 de março de 2024
  useEffect(() => {
    const updateTime = () => {
      const startDate = new Date('2024-03-20T00:00:00');
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      
      const totalMinutes = Math.floor(diffTime / (1000 * 60));
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = totalMinutes % 60;

      setTimeElapsed({
        days,
        hours,
        minutes,
        totalMinutes
      });
    };

    // Atualizar imediatamente
    updateTime();
    
    // Atualizar a cada minuto
    const interval = setInterval(updateTime, 60000);
    
    // Ativar animação na montagem
    setTimeout(() => setIsAnimating(true), 500);

    return () => clearInterval(interval);
  }, []);

  const handleClockClick = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Pergunta Principal */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            <span className="text-white">O</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              LUIZ
            </span>
            <br />
            <span className="text-white">PAGOU O</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              DAS
            </span>
            <br />
            <span className="text-white">HOJE?</span>
          </h1>
          
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Seção do Relógio */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Timer className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Tempo Desde 20 de Março de 2024
            </h2>
            <Clock className="w-6 h-6 text-green-400" />
          </div>
          
          <div 
            className={`cursor-pointer transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}
            onClick={handleClockClick}
          >
            {/* Display do Relógio Digital */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mb-6">
              <div className="bg-black/30 rounded-2xl p-4 border border-white/20">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text">
                  {timeElapsed.days.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium mt-2">DIAS</div>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-4 border border-white/20">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                  {timeElapsed.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium mt-2">HORAS</div>
              </div>
              
              <div className="bg-black/30 rounded-2xl p-4 border border-white/20">
                <div className="text-3xl md:text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text animate-pulse">
                  {timeElapsed.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm md:text-base text-white/80 font-medium mt-2">MINUTOS</div>
              </div>
            </div>

            {/* Contador Total de Minutos */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
              <div className="text-lg md:text-xl text-white/90 font-medium mb-2">
                Total de Minutos Decorridos
              </div>
              <div className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
                {timeElapsed.totalMinutes.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-300 mt-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-lg font-medium">
              Atualiza a cada minuto!
            </p>
          </div>
        </div>

        {/* Respostas estilo meme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
            <div className="text-4xl mb-2">🤔</div>
            <p className="text-white font-bold">TALVEZ?</p>
          </div>
          
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <div className="text-4xl mb-2">⏰</div>
            <p className="text-white font-bold">TIC TAC</p>
          </div>
          
          <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="text-4xl mb-2">💸</div>
            <p className="text-white font-bold">IMPOSTOS!</p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center">
          <p className="text-white/70 text-sm font-medium">
            Contando cada minuto desde 20 de março de 2024
          </p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;