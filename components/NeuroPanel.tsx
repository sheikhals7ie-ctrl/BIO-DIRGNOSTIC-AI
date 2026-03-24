import React from 'react';
import { Panel } from './Panel';
import { Loader } from './Loader';
import type { NeuroData, NeuroAnalysis } from '../types';
import { NEURO_QUESTIONS } from '../constants';

interface NeuroPanelProps {
    data: NeuroData;
    setData: React.Dispatch<React.SetStateAction<NeuroData>>;
    results: NeuroAnalysis | undefined;
    isLoading: boolean;
}

export const NeuroPanel: React.FC<NeuroPanelProps> = ({ data, setData, results, isLoading }) => {
    const handleInputChange = (id: string, value: string) => {
        setData(prev => ({...prev, [id]: value}));
    };

    return (
        <Panel title="Neurological Assessment">
            <div className="space-y-4">
                {NEURO_QUESTIONS.map(({id, question}) => (
                    <div key={id}>
                        <label className="text-xs text-cyan-300 block mb-1">{question}</label>
                        <input
                            type="text"
                            value={data[id]}
                            onChange={(e) => handleInputChange(id, e.target.value)}
                            className="w-full bg-[#0d2a3f] border border-[#214d68] text-white p-2"
                            placeholder="Enter your answer..."
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
                            <h4 className="font-semibold text-cyan-300">Cognitive Function Assessment</h4>
                            <p>{results.cognitiveFunctions}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-cyan-300">Memory Assessment</h4>
                            <p>{results.memoryAssessment}</p>
                        </div>
                    </div>
                 ) : !isLoading && (
                    <p className="text-gray-500 text-sm">Analysis will be shown here.</p>
                )}
            </div>
        </Panel>
    );
};