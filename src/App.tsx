import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Timer, DollarSign, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';

function App() {
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    totalMinutes: 0
  });
  const [debtCalculation, setDebtCalculation] = useState({
    totalOriginal: 0,
    totalMulta: 0,
    totalJuros: 0,
    totalFinal: 0,
    diasEmAtraso: 0,
    parcelasEmAtraso: 0
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Utilitário para datas
  const diferencaEmDias = (data1: Date, data2: Date): number => {
    const msPorDia = 1000 * 60 * 60 * 24;
    return Math.floor((data2.getTime() - data1.getTime()) / msPorDia);
  };

  // Simulação da taxa Selic acumulada (usamos 0,8% ao mês como estimativa média)
  const calcularSelicAcumulada = (meses: number, taxaMensal = 0.008): number => {
    return Math.pow(1 + taxaMensal, meses) - 1;
  };

  // Cálculo da multa (0,33% ao dia útil, limitado a 20%)
  const calcularMulta = (valor: number, diasCorridos: number): number => {
    const multa = valor * 0.0033 * diasCorridos;
    return Math.min(multa, valor * 0.20);
  };

  // Cálculo dos juros: Selic acumulada + 1% fixo no mês do pagamento
  const calcularJuros = (valor: number, mesesAtraso: number): number => {
    const selic = calcularSelicAcumulada(mesesAtraso);
    return valor * (selic + 0.01); // 1% fixo no mês do pagamento
  };

  // Calcular tempo e dívida
  useEffect(() => {
    const updateCalculations = () => {
      const startDate = new Date('2024-03-20T00:00:00');
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      
      // Cálculo do tempo
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

      // ----------- CONFIGURAÇÃO DAS PARCELAS ------------
      const valorParcela2024 = 76.60;
      const valorParcela2025 = 80.60;
      const dataAtual = now;
      const parcelas: { vencimento: Date, valor: number }[] = [];

      // Gerar parcelas de março/2024 até junho/2025
      for (let ano = 2024; ano <= 2025; ano++) {
        const mesInicio = ano === 2024 ? 2 : 0; // março é mês 2
        const mesFim = ano === 2024 ? 11 : 5;   // até junho/2025
        for (let mes = mesInicio; mes <= mesFim; mes++) {
          const vencimento = new Date(ano, mes, 20);
          const valor = ano === 2024 ? valorParcela2024 : valorParcela2025;
          parcelas.push({ vencimento, valor });
        }
      }

      // ----------- CÁLCULO TOTAL DAS PARCELAS ------------
      let totalOriginal = 0;
      let totalMulta = 0;
      let totalJuros = 0;

      parcelas.forEach((parcela, index) => {
        totalOriginal += parcela.valor;

        const diasAtraso = diferencaEmDias(new Date(parcela.vencimento.getTime() + 86400000), dataAtual);

        const mesesAtraso = (dataAtual.getFullYear() - parcela.vencimento.getFullYear()) * 12 +
                            (dataAtual.getMonth() - parcela.vencimento.getMonth()) - 1;

        const multa = calcularMulta(parcela.valor, diasAtraso);
        const juros = calcularJuros(parcela.valor, mesesAtraso);

        totalMulta += multa;
        totalJuros += juros;

        // Saída detalhada da parcela
        console.log(`Parcela ${index + 1} - Venc: ${parcela.vencimento.toLocaleDateString('pt-BR')}`);
        console.log(`  Valor Original: R$ ${parcela.valor.toFixed(2)}`);
        console.log(`  Dias em atraso: ${diasAtraso}`);
        console.log(`  Meses de atraso: ${mesesAtraso}`);
        console.log(`  Multa: R$ ${multa.toFixed(2)}`);
        console.log(`  Juros: R$ ${juros.toFixed(2)}`);
        console.log(`  Total da parcela com acréscimos: R$ ${(parcela.valor + multa + juros).toFixed(2)}\n`);
      });

      const totalFinal = totalOriginal + totalMulta + totalJuros;

      console.log("========= RESUMO FINAL =========");
      console.log(`Total Original: R$ ${totalOriginal.toFixed(2)}`);
      console.log(`Total Multa:    R$ ${totalMulta.toFixed(2)}`);
      console.log(`Total Juros:    R$ ${totalJuros.toFixed(2)}`);
      console.log(`Total Final:    R$ ${totalFinal.toFixed(2)}`);

      // Calcular dias em atraso desde a primeira parcela vencida
      const primeiraParcela = new Date('2024-03-20');
      const diasEmAtraso = diferencaEmDias(primeiraParcela, dataAtual);

      setDebtCalculation({
        totalOriginal,
        totalMulta,
        totalJuros,
        totalFinal,
        diasEmAtraso,
        parcelasEmAtraso: parcelas.length
      });
    };

    // Atualizar imediatamente
    updateCalculations();
    
    // Atualizar a cada minuto
    const interval = setInterval(updateCalculations, 60000);
    
    // Ativar animação na montagem
    setTimeout(() => setIsAnimating(true), 500);

    return () => clearInterval(interval);
  }, []);

  const handleClockClick = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
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

        {/* Seção da Dívida */}
        <div className="bg-red-500/10 backdrop-blur-md rounded-3xl p-8 border border-red-500/30 shadow-2xl mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <DollarSign className="w-6 h-6 text-red-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">
              💸 Quanto o Luiz Deve? 💸
            </h2>
            <Calculator className="w-6 h-6 text-yellow-400" />
          </div>

          {/* Estatísticas da Dívida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Dias em Atraso</h3>
              </div>
              <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text">
                {debtCalculation.diasEmAtraso}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Parcelas em Atraso</h3>
              </div>
              <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
                {debtCalculation.parcelasEmAtraso}
              </div>
            </div>
          </div>

          {/* Breakdown da Dívida */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-500/30">
              <div className="text-sm text-blue-300 font-medium mb-2">VALOR ORIGINAL</div>
              <div className="text-xl md:text-2xl font-black text-white">
                {formatCurrency(debtCalculation.totalOriginal)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-500/30">
              <div className="text-sm text-orange-300 font-medium mb-2">MULTA (0,33%/dia)</div>
              <div className="text-xl md:text-2xl font-black text-white">
                {formatCurrency(debtCalculation.totalMulta)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
              <div className="text-sm text-yellow-300 font-medium mb-2">JUROS (SELIC + 1%)</div>
              <div className="text-xl md:text-2xl font-black text-white">
                {formatCurrency(debtCalculation.totalJuros)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-300" />
                <div className="text-sm text-red-300 font-medium">TOTAL GERAL</div>
              </div>
              <div className="text-xl md:text-2xl font-black text-transparent bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text animate-pulse">
                {formatCurrency(debtCalculation.totalFinal)}
              </div>
            </div>
          </div>

          {/* Valor Total Destacado */}
          <div className="bg-gradient-to-r from-red-600/30 to-pink-600/30 rounded-3xl p-8 border-2 border-red-500/50">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-4">
                🚨 VALOR TOTAL DA DÍVIDA 🚨
              </div>
              <div className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-red-400 via-pink-500 to-red-600 bg-clip-text animate-pulse">
                {formatCurrency(debtCalculation.totalFinal)}
              </div>
              <div className="text-lg text-red-200 mt-4 font-medium">
                E continua crescendo a cada dia! 📈
              </div>
            </div>
          </div>

          {/* Detalhes do Cálculo */}
          <div className="mt-6 bg-black/20 rounded-2xl p-6 border border-white/10">
            <div className="text-center text-white/80 text-sm">
              <p className="mb-2">
                <strong>Metodologia:</strong> Multa de 0,33% por dia corrido (máx. 20%) + Juros SELIC acumulada (≈0,8%/mês) + 1% fixo
              </p>
              <p className="mb-2">
                Cálculo baseado em {debtCalculation.parcelasEmAtraso} parcelas (março/2024 a junho/2025)
              </p>
              <p className="text-xs text-white/60">
                Valores: R$ 76,60 (2024) | R$ 80,60 (2025) | Veja o console para detalhes de cada parcela
              </p>
            </div>
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
            Contando cada minuto e cada centavo desde 20 de março de 2024
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