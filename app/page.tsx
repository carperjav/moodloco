'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

type Mood = 'increible' | 'bien' | 'normal' | 'mal' | 'horrible';
type Energy = 'baja' | 'media' | 'alta';

interface MoodEntry {
  date: string;
  mood: Mood;
  text: string;
  energy: Energy;
  word: string;
  timestamp: number;
}

const MOODS: { id: Mood; emoji: string; label: string; colorClass: string; activeClass: string; calendarClass: string }[] = [
  { id: 'horrible', emoji: '😢', label: 'Horrible', colorClass: 'text-tertiary', activeClass: 'bg-tertiary/20 ring-tertiary/50', calendarClass: 'bg-tertiary text-on-tertiary' },
  { id: 'mal', emoji: '😞', label: 'Mal', colorClass: 'text-tertiary-fixed', activeClass: 'bg-tertiary-fixed/20 ring-tertiary-fixed/50', calendarClass: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { id: 'normal', emoji: '😐', label: 'Normal', colorClass: 'text-on-surface', activeClass: 'bg-surface-container-highest ring-outline-variant', calendarClass: 'bg-surface-variant text-on-surface-variant' },
  { id: 'bien', emoji: '😊', label: 'Bien', colorClass: 'text-primary', activeClass: 'bg-primary/20 ring-primary/50', calendarClass: 'bg-primary text-on-primary' },
  { id: 'increible', emoji: '😄', label: 'Increíble', colorClass: 'text-secondary', activeClass: 'bg-secondary/20 ring-secondary/50', calendarClass: 'bg-secondary text-on-secondary' },
];

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewingMonth, setViewingMonth] = useState<Date>(new Date());
  const [entries, setEntries] = useState<Record<string, MoodEntry>>({});
  
  // Form state
  const [mood, setMood] = useState<Mood | null>(null);
  const [text, setText] = useState('');
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [word, setWord] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('risueno_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing entries', e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('risueno_entries', JSON.stringify(entries));
    }
  }, [entries, mounted]);

  useEffect(() => {
    const dateStr = formatDate(selectedDate);
    const entry = entries[dateStr];
    if (entry) {
      setMood(entry.mood);
      setText(entry.text);
      setEnergy(entry.energy);
      setWord(entry.word);
    } else {
      setMood(null);
      setText('');
      setEnergy(null);
      setWord('');
    }
  }, [selectedDate, entries]);

  const handleSave = () => {
    if (!mood) return;
    setIsSaving(true);
    
    const dateStr = formatDate(selectedDate);
    const newEntry: MoodEntry = {
      date: dateStr,
      mood,
      text,
      energy: energy || 'media',
      word,
      timestamp: Date.now(),
    };

    setEntries(prev => ({ ...prev, [dateStr]: newEntry }));
    
    setTimeout(() => setIsSaving(false), 600);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const year = viewingMonth.getFullYear();
  const month = viewingMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setViewingMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setViewingMonth(new Date(year, month + 1, 1));

  if (!mounted) return null;

  return (
    <>
      <header className="bg-[#0d0d15]/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 border-b border-white/5">
        {showLoginBanner && (
          <div className="bg-primary/10 text-primary text-xs text-center py-2 px-4 flex justify-between items-center">
            <span>Inicia sesión con Google para guardar tu historial de forma segura.</span>
            <button onClick={() => setShowLoginBanner(false)} className="text-primary hover:text-primary-fixed ml-4">✕</button>
          </div>
        )}
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary w-6 h-6" />
            <h1 className="text-2xl font-display italic text-primary tracking-tight">risueño</h1>
          </div>
          <button className="flex items-center gap-3 bg-surface-container-high p-1.5 pr-4 rounded-full border border-white/5 group hover:bg-surface-container-highest transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-on-surface-variant">
              <span className="text-xs font-bold">?</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold leading-none">Invitado</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-on-surface-variant">Iniciar sesión</span>
              </div>
            </div>
          </button>
        </div>
      </header>

      <main className={`pt-${showLoginBanner ? '32' : '24'} pb-20 px-6 max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start transition-all`}>
        {/* Left Side: Calendar */}
        <section className="lg:col-span-5 w-full">
          <header className="mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-on-surface italic mb-2">Tu {MONTHS[selectedDate.getMonth()]}</h2>
            <p className="font-body text-on-surface-variant text-sm">Navega por tus recuerdos y emociones.</p>
          </header>

          <div className="bg-surface-container-low rounded-[2rem] p-6 lg:p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-display text-xl italic capitalize">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
                <span key={d} className="text-[10px] uppercase tracking-tighter text-on-surface-variant font-bold">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {blanks.map(b => (
                <div key={`blank-${b}`} className="aspect-square"></div>
              ))}
              {days.map(d => {
                const date = new Date(year, month, d);
                const dateStr = formatDate(date);
                const isSelected = formatDate(selectedDate) === dateStr;
                const entry = entries[dateStr];
                
                let bgClass = 'bg-surface-container-highest hover:bg-surface-bright text-on-surface';
                if (entry) {
                  const moodDef = MOODS.find(m => m.id === entry.mood);
                  if (moodDef) {
                    bgClass = `${moodDef.calendarClass} font-bold shadow-md shadow-current/20`;
                  }
                }

                return (
                  <motion.button
                    key={d}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square flex items-center justify-center text-sm rounded-xl transition-colors relative ${bgClass} ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface shadow-lg shadow-primary/20 scale-110 z-10' : ''}`}
                  >
                    {d}
                    {entry && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-50"></span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 p-6 border-l-2 border-primary/30 bg-surface-container-lowest/50 rounded-r-3xl">
            <p className="font-display text-lg text-primary-fixed italic leading-relaxed">
              "Las emociones son los colores del alma, y tú eres el artista de tu propia serenidad."
            </p>
          </div>
        </section>

        {/* Right Side: Form */}
        <section className="lg:col-span-7 w-full">
          <div className="bg-surface-container-high rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-10">
                <h2 className="font-display text-4xl text-on-surface italic">
                  {formatDate(selectedDate) === formatDate(new Date()) ? '¿Cómo te sientes hoy?' : `Día ${selectedDate.getDate()}`}
                </h2>
                {entries[formatDate(selectedDate)] && (
                  <span className="text-xs font-label text-primary bg-primary/10 px-3 py-1 rounded-full">Guardado</span>
                )}
              </div>

              {/* Emoji Selector */}
              <div className="mb-12">
                <label className="block font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-bold">Estado de Ánimo</label>
                <div className="flex justify-between items-center gap-2 overflow-x-auto hide-scrollbar pb-4">
                  {MOODS.map(m => {
                    const isActive = mood === m.id;
                    return (
                      <motion.button
                        key={m.id}
                        onClick={() => setMood(m.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`group flex flex-col items-center gap-3 min-w-[70px] transition-all rounded-2xl py-3 px-1 ${isActive ? `ring-2 ${m.activeClass}` : 'hover:bg-surface-container-highest'}`}
                      >
                        <motion.span 
                          animate={isActive ? { scale: [1, 1.2, 1.1], rotate: [0, -10, 10, 0] } : { scale: 1 }}
                          className={`text-4xl transition-all duration-300 ${isActive ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}
                        >
                          {m.emoji}
                        </motion.span>
                        <span className={`text-[10px] font-bold transition-colors ${isActive ? m.colorClass : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                          {m.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-10">
                <label htmlFor="entry" className="block font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-bold">¿Qué ha pasado?</label>
                <textarea 
                  id="entry"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={150}
                  placeholder="Cuéntame un poco..."
                  rows={3}
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 p-0 py-2 font-body text-lg leading-relaxed placeholder:text-on-surface-variant/30 resize-none transition-all outline-none"
                />
                <div className="flex justify-end mt-2">
                  <span className="text-[10px] text-on-surface-variant font-mono">{text.length} / 150</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                {/* Energy */}
                <div>
                  <label className="block font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-bold">Nivel de Energía</label>
                  <div className="flex gap-2">
                    {(['baja', 'media', 'alta'] as Energy[]).map(e => (
                      <button 
                        key={e}
                        onClick={() => setEnergy(e)}
                        className={`flex-1 py-3 px-2 rounded-xl font-label text-xs font-bold transition-all capitalize ${energy === e ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20' : 'bg-surface-container-highest border border-white/5 hover:bg-surface-bright text-on-surface-variant'}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word */}
                <div>
                  <label htmlFor="word" className="block font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-4 font-bold">Una palabra</label>
                  <input 
                    id="word"
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    maxLength={30}
                    placeholder="Ej: Calma"
                    className="w-full bg-surface-container-highest rounded-xl border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary px-4 py-3 font-body text-sm transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50"
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button 
                onClick={handleSave}
                disabled={!mood}
                animate={isSaving ? { scale: [1, 0.95, 1.05, 1], backgroundColor: ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-primary)'] } : {}}
                className={`group w-full py-5 rounded-2xl font-bold font-label uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${mood ? 'bg-primary hover:bg-primary-fixed text-on-primary shadow-xl shadow-primary/10 cursor-pointer' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'}`}
              >
                <span>{isSaving ? 'Guardado ✨' : 'Guardar sentimientos'}</span>
                {!isSaving && <Sparkles className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
