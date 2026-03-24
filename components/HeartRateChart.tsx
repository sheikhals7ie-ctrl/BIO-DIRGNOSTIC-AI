
import React, { useMemo } from 'react';
import { LineChart, Line, YAxis, XAxis, ResponsiveContainer } from 'recharts';

const generateHeartRateData = () => {
  let data = [];
  let lastVal = 80;
  for (let i = 0; i < 50; i++) {
    let nextVal;
    if (i % 10 === 8) {
      nextVal = lastVal + Math.random() * 40 + 20; // Spike up
    } else if (i % 10 === 9) {
      nextVal = lastVal - Math.random() * 30 - 10; // Spike down
    } else {
      nextVal = lastVal + (Math.random() - 0.5) * 10;
    }
    lastVal = nextVal > 50 && nextVal < 180 ? nextVal : 80; // Clamp
    data.push({ name: i, bpm: lastVal });
  }
  return data;
};

export const HeartRateChart: React.FC = () => {
    const data = useMemo(() => generateHeartRateData(), []);

    return (
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
            <div className="text-xs text-cyan-300 uppercase">Heart Rate</div>
            <div className="text-3xl font-bold text-white text-glow">161 <span className="text-lg">BPM</span></div>
        </div>
        <ResponsiveContainer width="100%" height={100}>
            <LineChart data={data}>
                <XAxis dataKey="name" hide={true} />
                <YAxis domain={[40, 200]} hide={true} />
                <Line 
                    type="monotone" 
                    dataKey="bpm" 
                    stroke="#ff3b3b" 
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={false}
                    />
            </LineChart>
        </ResponsiveContainer>
      </div>
    );
};
