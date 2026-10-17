import React, { useState, useEffect } from 'react';
import { VersionedGameConfig, QuizQuestion } from '../types/arcade';
import { Trophy, Clock, CheckCircle2, XCircle, Zap, ArrowRight, HelpCircle } from 'lucide-react';

interface BrandQuizEngineProps {
  config: VersionedGameConfig;
  onGameOver: (score: number, stats: { itemsCollected: number; obstaclesHit: number; accuracy: number }) => void;
}

export const BrandQuizEngine: React.FC<BrandQuizEngineProps> = ({ config, onGameOver }) => {
  const questions: QuizQuestion[] = config.game.quizQuestions && config.game.quizQuestions.length > 0
    ? config.game.quizQuestions
    : [
        {
          id: 'def1',
          question: '¿Cuál es la ventaja de la finalidad sub-segundo en Avalanche?',
          options: ['Transacciones confirmadas en <800ms', 'Aumenta el tamaño del bloque a 1GB', 'Desactiva el gas', 'Minado con tarjetas gráficas'],
          correctIndex: 0,
          explanation: 'La finalidad sub-segundo permite experiencias fluidas tipo Web2 sin esperas.',
        },
        {
          id: 'def2',
          question: '¿Qué permite la actualización Avalanche9000?',
          options: ['Crear L1s soberanas con 99.9% menor costo', 'Cambiar el algoritmo a Proof of Work', 'Fusionar todas las cadenas', 'Eliminar contratos inteligentes'],
          correctIndex: 0,
          explanation: 'Avalanche9000 democratiza la creación de subnets L1 para cualquier proyecto.',
        },
        {
          id: 'def3',
          question: '¿Cómo se comunican las Subnets sin necesidad de puentes vulnerables?',
          options: ['Teleporter con Avalanche Warp Messaging (AWM)', 'Correos electrónicos', 'Servidores centralizados', 'Tokens envueltos en Ethereum'],
          correctIndex: 0,
          explanation: 'AWM valida mensajes directamente mediante firmas BLS de los validadores.',
        },
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(12);

  const currentQ = questions[currentIndex];
  const pointsPerQ = config.game.scoring.correctAnswerPoints || 25;

  // Question countdown timer
  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // Timeout
    setStreak(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      const timeBonus = Math.round(questionTimeLeft * 1.5);
      const streakBonus = streak >= 2 ? 15 : 0;
      const roundPoints = pointsPerQ + timeBonus + streakBonus;

      setScore((prev) => prev + roundPoints);
      setStreak((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setQuestionTimeLeft(12);
    } else {
      // Quiz Finished
      const finalAccuracy = Math.round(((correctCount + (selectedOption === currentQ.correctIndex ? 0 : 0)) / questions.length) * 100);
      onGameOver(score, {
        itemsCollected: correctCount,
        obstaclesHit: questions.length - correctCount,
        accuracy: finalAccuracy,
      });
    }
  };

  const progressPercent = ((questionTimeLeft / 12) * 100).toFixed(0);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 bg-[#0B0E14] text-white select-none">
      {/* Header HUD */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-base text-amber-400">{score}</span>
            <span className="text-[10px] text-slate-400">PTS</span>
          </div>

          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-bold animate-pulse">
                🔥 {streak} Racha
              </span>
            )}
            <span className="text-slate-400">
              Pregunta {currentIndex + 1} de {questions.length}
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full transition-all duration-1000 ${
              questionTimeLeft <= 3 ? 'bg-red-500' : 'bg-gradient-to-r from-red-500 to-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="my-auto py-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
          <span className="text-[10px] uppercase font-mono font-bold text-red-400 block mb-1">
            Trivia Oficial
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            let btnStyle = 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-md shadow-emerald-500/20';
              } else if (isSelected) {
                btnStyle = 'border-red-500 bg-red-950/70 text-red-300';
              } else {
                btnStyle = 'border-slate-800/40 opacity-40 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Callout */}
        {isAnswered && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 animate-fadeIn">
            <span className="font-bold text-white block mb-0.5">
              {selectedOption === currentQ.correctIndex ? '¡Correcto!' : 'Respuesta correcta:'}
            </span>
            <p className="text-[11px] text-slate-400">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono">
          {questionTimeLeft}s restantes
        </span>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/30"
          >
            <span>{currentIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Guardar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
