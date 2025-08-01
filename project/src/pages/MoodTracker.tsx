import React, { useEffect, useState } from 'react';
import { Zap, Cloud } from 'lucide-react';
import { Mood } from '../types';
import { formatDate } from '../utils/dateUtils';

interface MoodTrackerProps {
  moods: Record<string, Mood>;
  onAddMood: (mood: Mood) => void;
}

const getIntensityGradient = (label: string, rating: number) => {
  if (label === "Stress Level") {
    if (rating === 5) return "bg-gradient-to-r from-red-500 to-red-700";
    if (rating === 4) return "bg-gradient-to-r from-orange-400 to-red-500";
    if (rating === 3) return "bg-gradient-to-r from-yellow-200 to-orange-400";
    if (rating === 2) return "bg-gradient-to-r from-green-600 to-yellow-200";
    return "bg-gradient-to-r from-green-500 to-green-700";
  } else {
    if (rating === 1) return "bg-gradient-to-r from-red-700 to-red-500";
    if (rating === 2) return "bg-gradient-to-r from-red-500 to-orange-400";
    if (rating === 3) return "bg-gradient-to-r from-orange-300 to-yellow-200";
    if (rating === 4) return "bg-gradient-to-r from-yellow-200 to-green-600";
    return "bg-gradient-to-r from-green-600 to-green-500";
  }
};


export const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, onAddMood }) => {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [note, setNote] = useState('');

  const today = formatDate(new Date());
  const todayMood = moods[today];

  const moodEmojis = ['😢', '😕', '😐', '😊', '😄'];
  const moodLabels = ['Terrible', 'Bad', 'Okay', 'Good', 'Great'];

   // tabtitle
            useEffect(()=>{
              document.title='Habit Heat-Mood'
            },[])

  const handleSubmit = () => {
    const mood: Mood = {
      date: today,
      rating: selectedMood,
      energy,
      stress,
      note: note.trim() || undefined
    };
    
    onAddMood(mood);
    setNote('');
  };

  const RatingSlider = ({ 
    value, 
    onChange, 
    label, 
    icon: Icon, 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    label: string; 
    icon: any; 
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIntensityGradient(label, value)}`}>
            <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium text-gray-900 dark:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400 w-8">Low</span>
        <div className="flex-1 flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange(rating)}
              className={`flex-1 h-8 rounded-lg transition-all ${
                value >= rating 
                  ? `${getIntensityGradient(label, rating).replace('text-', 'bg-').replace('-500', '-500')} text-white` 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 w-8">High</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mood Tracker
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Track your daily mood and energy levels
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            How are you feeling today?
          </h3>
          
          {todayMood ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{moodEmojis[todayMood.rating - 1]}</span>
                <div>
                  <div className="font-medium text-green-800 dark:text-green-200">
                    Mood logged for today: {moodLabels[todayMood.rating - 1]}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Energy: {todayMood.energy}/5 • Stress: {todayMood.stress}/5
                  </div>
                </div>
              </div>
              {todayMood.note && (
                <p className="text-sm text-green-700 dark:text-green-300 italic">
                  "{todayMood.note}"
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mood Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  {moodEmojis.map((emoji, index) => (
                    <div key={index}>
                    <button onClick={() => setSelectedMood(index + 1)} className={`p-4 rounded-2xl transition-all flex flex-col items-center gap-2 ${selectedMood === index + 1? "bg-blue-100 dark:bg-blue-900 scale-110 shadow-lg": "hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"}`}>
                      <span className="text-3xl">{emoji}</span>
                    </button>
                    <div className="text-center mt-4">
                    {selectedMood === index + 1 && (
                        <span className="text-lg font-medium text-gray-900 dark:text-white">
                          {moodLabels[index]}
                        </span>
                      )}
                    </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Energy and Stress Sliders */}
              <div className="space-y-6">
                <RatingSlider
                  value={energy}
                  onChange={setEnergy}
                  label="Energy Level"
                  icon={Zap}
                />
                
                <RatingSlider
                  value={stress}
                  onChange={setStress}
                  label="Stress Level"
                  icon={Cloud}
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="How was your day? Any thoughts or reflections..."
                  className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
              >
                Save Today's Mood
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Moods */}
      {Object.keys(moods).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Moods
          </h3>
          <div className="grid gap-3">
            {Object.entries(moods)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 7)
              .map(([date, mood]) => (
                <div key={date} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{moodEmojis[mood.rating - 1]}</span>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {moodLabels[mood.rating - 1]}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      <div>Energy: {mood.energy}/5</div>
                      <div>Stress: {mood.stress}/5</div>
                    </div>
                  </div>
                  {mood.note && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                      "{mood.note}"
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};