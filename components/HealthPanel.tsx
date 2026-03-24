import React from 'react';
import { Panel } from './Panel';
import { Loader } from './Loader';
import type { HealthData, HealthAnalysis } from '../types';
import { HeartRateChart } from './HeartRateChart';

interface HealthPanelProps {
    data: HealthData;
    setData: React.Dispatch<React.SetStateAction<HealthData>>;
    results: HealthAnalysis | undefined;
    isLoading: boolean;
}

const GenderToggle: React.FC<{ gender: 'male' | 'female', setGender: (gender: 'male' | 'female') => void }> = ({ gender, setGender }) => {
    return (
        <div className="flex bg-[#0d2a3f] border border-[#214d68] rounded-md p-1">
            <button 
                onClick={() => setGender('male')}
                className={`w-1/2 p-2 text-sm uppercase transition-colors duration-300 ${gender === 'male' ? 'bg-[#00f0ff] text-[#030613] font-bold' : 'text-cyan-300'}`}
            >
                Male
            </button>
            <button 
                onClick={() => setGender('female')}
                className={`w-1/2 p-2 text-sm uppercase transition-colors duration-300 ${gender === 'female' ? 'bg-[#00f0ff] text-[#030613] font-bold' : 'text-cyan-300'}`}
            >
                Female
            </button>
        </div>
    );
};


export const HealthPanel: React.FC<HealthPanelProps> = ({ data, setData, results, isLoading }) => {

    const bmi = data.weight > 0 && data.height > 0 ? data.weight / ((data.height / 100) ** 2) : 0;

    return (
        <Panel title="Physical Health Reading">
             <div className="space-y-4">
                <HeartRateChart />
                <GenderToggle 
                    gender={data.gender}
                    setGender={(g) => setData(d => ({...d, gender: g}))}
                />
             </div>
           
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-xs text-cyan-300 block mb-1">Height (cm)</label>
                    <input 
                        type="number"
                        value={data.height}
                        onChange={e => setData(d => ({ ...d, height: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-[#0d2a3f] border border-[#214d68] text-white p-2 text-center font-bold text-lg"
                    />
                </div>
                 <div>
                    <label className="text-xs text-cyan-300 block mb-1">Weight (kg)</label>
                    <input 
                        type="number"
                        value={data.weight}
                        onChange={e => setData(d => ({ ...d, weight: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-[#0d2a3f] border border-[#214d68] text-white p-2 text-center font-bold text-lg"
                    />
                </div>
            </div>
            <div className="mt-4 bg-[#0d2a3f]/50 p-2 text-center">
                <span className="text-xs uppercase text-cyan-300">Body Mass Index</span>
                <p className="text-2xl font-bold text-white">{bmi.toFixed(1)}</p>
            </div>

            <div className="mt-4 border-t-2 border-[#214d68] pt-4">
                <h3 className="font-bold text-[#00f0ff] uppercase mb-2">Analysis</h3>
                {isLoading && <Loader />}
                {results ? (
                    <div className="space-y-2 text-sm text-gray-300 overflow-y-auto max-h-48 pr-2">
                        <p><strong className="text-cyan-300">Status:</strong> {results.bodyStatus}</p>
                        <p><strong className="text-cyan-300">Bio-Age Est:</strong> {results.biologicalAge}</p>
                        <p><strong className="text-cyan-300">Cardio Efficiency:</strong> {results.cardiovascularEfficiency}</p>
                        {results.dietPlan && <div><strong className="text-cyan-300">Diet Plan:</strong> {results.dietPlan}</div>}
                        {results.exercisePlan && <div><strong className="text-cyan-300">Exercise Plan:</strong> {results.exercisePlan}</div>}
                    </div>
                 ) : !isLoading && (
                    <p className="text-gray-500 text-sm">Analysis will be shown here.</p>
                )}
            </div>
        </Panel>
    );
};