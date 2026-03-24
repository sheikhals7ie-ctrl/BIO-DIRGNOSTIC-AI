import React from 'react';
import { Panel } from './Panel';
import { Loader } from './Loader';
import type { AcademicData, AcademicAnalysis } from '../types';
import { SUBJECTS } from '../constants';

interface AcademicPanelProps {
    data: AcademicData;
    setData: React.Dispatch<React.SetStateAction<AcademicData>>;
    results: AcademicAnalysis | undefined;
    isLoading: boolean;
}

export const AcademicPanel: React.FC<AcademicPanelProps> = ({ data, setData, results, isLoading }) => {
    const handleSliderChange = (subject: string, value: number) => {
        setData(prev => ({ ...prev, [subject]: value }));
    };

    return (
        <Panel title="Academic Assessment">
            <div className="space-y-3">
                {SUBJECTS.map(subject => (
                    <div key={subject}>
                        <div className="flex justify-between items-center text-xs mb-1">
                            <label htmlFor={subject} className="font-semibold text-cyan-300">{subject}</label>
                            <span className="px-2 py-0.5 bg-[#0d2a3f] text-cyan-300 rounded">{data[subject]}</span>
                        </div>
                        <input
                            id={subject}
                            type="range"
                            min="0"
                            max="100"
                            value={data[subject]}
                            onChange={(e) => handleSliderChange(subject, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6 border-t-2 border-[#214d68] pt-4">
                <h3 className="font-bold text-[#00f0ff] uppercase mb-2">Analysis</h3>
                {isLoading && <Loader />}
                {results ? (
                    <div className="space-y-4 text-sm text-gray-300">
                        <div>
                            <h4 className="font-semibold text-cyan-300">Personality Profile</h4>
                            <p>{results.personality}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-cyan-300">Future Effectiveness Index</h4>
                            <p>{results.futureEffectiveness}</p>
                        </div>
                    </div>
                ) : !isLoading && (
                    <p className="text-gray-500 text-sm">Analysis will be shown here.</p>
                )}
            </div>
        </Panel>
    );
};