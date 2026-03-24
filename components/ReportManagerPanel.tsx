import React from 'react';
import { Panel } from './Panel';
import { PlusIcon, TrashIcon } from './Icons';
import { RoboticHeadAnimation } from './Visuals';
import type { Report } from '../types';

interface ReportManagerPanelProps {
    reports: Report[];
    currentReportId: string | null;
    onSelectReport: (id: string) => void;
    onNewReport: () => void;
    onDeleteReport: (id: string) => void;
}

export const ReportManagerPanel: React.FC<ReportManagerPanelProps> = ({
    reports,
    currentReportId,
    onSelectReport,
    onNewReport,
    onDeleteReport
}) => {
    return (
        <Panel title="Report Manager">
            <div className="flex justify-center items-center mb-4">
                <RoboticHeadAnimation />
            </div>
            <button
                onClick={onNewReport}
                className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-[#0d2a3f] border-2 border-[#2dffb5] text-[#2dffb5] font-bold uppercase tracking-wider transition-all duration-300 hover:bg-[#2dffb5] hover:text-[#030613]"
            >
                <PlusIcon className="w-5 h-5" />
                New Report
            </button>
            <div className="space-y-2 max-h-[calc(100vh-450px)] overflow-y-auto">
                {reports.length > 0 ? reports.map(report => (
                    <div
                        key={report.id}
                        className={`
                            flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200
                            ${currentReportId === report.id ? 'bg-[#00f0ff] text-[#030613]' : 'bg-[#0d2a3f] hover:bg-[#1a4b6d]'}
                        `}
                    >
                        <div onClick={() => onSelectReport(report.id)} className="flex-grow">
                            <p className={`font-bold text-sm ${currentReportId === report.id ? 'text-[#030613]' : 'text-cyan-300'}`}>
                                Report - {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                            <p className={`text-xs ${currentReportId === report.id ? 'text-gray-800' : 'text-gray-400'}`}>
                                {new Date(report.createdAt).toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteReport(report.id);
                            }}
                            className={`p-1 rounded ${currentReportId === report.id ? 'hover:bg-red-500/50' : 'text-red-400 hover:bg-red-900/50'}`}
                            aria-label={`Delete report from ${new Date(report.createdAt).toLocaleString()}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 text-sm">No saved reports.</p>
                )}
            </div>
        </Panel>
    );
};