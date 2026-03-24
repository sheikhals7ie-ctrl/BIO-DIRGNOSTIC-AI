import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AcademicPanel } from './components/AcademicPanel';
import { HealthPanel } from './components/HealthPanel';
import { NeuroPanel } from './components/NeuroPanel';
import { ReportManagerPanel } from './components/ReportManagerPanel';
import { getFullAnalysis } from './services/geminiService';
import { Loader } from './components/Loader';
import type { AcademicData, HealthData, NeuroData, AnalysisResult, Report } from './types';
import { SUBJECTS, NEURO_QUESTIONS } from './constants';
import { PowerIcon, PrintIcon } from './components/Icons';

const getDefaultState = () => ({
    academicData: SUBJECTS.reduce((acc, subject) => ({ ...acc, [subject]: 50 }), {}),
    healthData: {
        height: 170,
        weight: 65,
        gender: 'male' as const,
    },
    neuroData: NEURO_QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {}),
    analysisResult: null
});


const App: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [currentReportId, setCurrentReportId] = useState<string | null>(null);

    const [academicData, setAcademicData] = useState<AcademicData>(getDefaultState().academicData);
    const [healthData, setHealthData] = useState<HealthData>(getDefaultState().healthData);
    const [neuroData, setNeuroData] = useState<NeuroData>(getDefaultState().neuroData);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Load reports from localStorage on initial render
    useEffect(() => {
        try {
            const savedReports = localStorage.getItem('bio-diagnostic-reports');
            if (savedReports) {
                const parsedReports = JSON.parse(savedReports);
                setReports(parsedReports);
                if (parsedReports.length > 0) {
                   setCurrentReportId(parsedReports[0].id);
                }
            }
        } catch (e) {
            console.error("Failed to load reports from localStorage", e);
        }
    }, []);

    // Save reports to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('bio-diagnostic-reports', JSON.stringify(reports));
        } catch(e) {
            console.error("Failed to save reports to localStorage", e);
        }
    }, [reports]);

     // Update form data when currentReportId changes
    useEffect(() => {
        if (currentReportId) {
            const report = reports.find(r => r.id === currentReportId);
            if (report) {
                setAcademicData(report.academicData);
                setHealthData(report.healthData);
                setNeuroData(report.neuroData);
                setAnalysisResult(report.analysisResult);
            }
        } else {
            // New report mode
            const defaults = getDefaultState();
            setAcademicData(defaults.academicData);
            setHealthData(defaults.healthData);
            setNeuroData(defaults.neuroData);
            setAnalysisResult(defaults.analysisResult);
        }
    }, [currentReportId, reports]);


    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        if (Object.values(neuroData).some(answer => answer.trim() === '')) {
            setError("Please answer all neurological assessment questions before proceeding.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await getFullAnalysis(academicData, healthData, neuroData);
            setAnalysisResult(result);

            const newReport: Report = {
                id: currentReportId || `report-${Date.now()}`,
                createdAt: new Date().toISOString(),
                academicData,
                healthData,
                neuroData,
                analysisResult: result,
            };

            if (currentReportId) { // Update existing report
                setReports(prev => prev.map(r => r.id === currentReportId ? newReport : r));
            } else { // Add new report
                setReports(prev => [newReport, ...prev]);
                setCurrentReportId(newReport.id);
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [academicData, healthData, neuroData, currentReportId]);
    
    const handleDeleteReport = (id: string) => {
        if (window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
            setReports(prev => prev.filter(r => r.id !== id));
            if (currentReportId === id) {
                setCurrentReportId(reports.length > 1 ? reports[0].id : null);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const isAnalyzeDisabled = isLoading || Object.values(neuroData).some(answer => answer.trim() === '');

    const currentReportForPrint = useMemo(() => reports.find(r => r.id === currentReportId), [reports, currentReportId]);

    return (
        <div className="min-h-screen bg-[#030613] p-4 lg:p-8 print-container">
            <header className="flex justify-between items-center mb-6 print-hide">
                <h1 className="text-2xl lg:text-4xl font-bold text-[#00f0ff] text-glow uppercase tracking-widest">
                    Bio Diagnostic AI
                </h1>
                <div className="flex items-center gap-4">
                    {analysisResult && (
                         <button
                            onClick={handlePrint}
                            className="p-3 bg-[#0d2a3f] border-2 border-[#2dffb5] text-[#2dffb5] hover:bg-[#2dffb5] hover:text-[#030613] transition-colors"
                            aria-label="Print Report"
                         >
                            <PrintIcon className="w-6 h-6" />
                        </button>
                    )}
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzeDisabled}
                        className={`
                            px-6 py-3 bg-[#0d2a3f] border-2 border-[#00f0ff] text-[#00f0ff] font-bold uppercase tracking-wider
                            flex items-center gap-3 transition-all duration-300
                            hover:bg-[#00f0ff] hover:text-[#030613] hover:shadow-[0_0_20px_#00f0ff]
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0d2a3f] disabled:hover:text-[#00f0ff] disabled:hover:shadow-none
                        `}
                    >
                        <PowerIcon className="w-6 h-6" />
                        <span>{isLoading ? 'ANALYZING...' : (currentReportId ? 'Update Scan' : 'Initiate Scan')}</span>
                    </button>
                </div>
            </header>

            {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 mb-4 text-center print-hide">{error}</div>}

            <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                <div className="lg:col-span-1 xl:col-span-1 input-panel print-hide">
                    <ReportManagerPanel
                        reports={reports}
                        currentReportId={currentReportId}
                        onSelectReport={setCurrentReportId}
                        onNewReport={() => setCurrentReportId(null)}
                        onDeleteReport={handleDeleteReport}
                    />
                </div>
                <div className="lg:col-span-2 xl:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 input-panel print-hide">
                     <HealthPanel
                        data={healthData} 
                        setData={setHealthData} 
                        results={analysisResult?.healthAnalysis}
                        isLoading={isLoading && !analysisResult}
                    />
                     <NeuroPanel
                        data={neuroData} 
                        setData={setNeuroData} 
                        results={analysisResult?.neuroAnalysis}
                        isLoading={isLoading && !analysisResult}
                    />
                </div>
                <div className="lg:col-span-3 xl:col-span-1 input-panel print-hide">
                     <AcademicPanel 
                        data={academicData} 
                        setData={setAcademicData} 
                        results={analysisResult?.academicAnalysis}
                        isLoading={isLoading && !analysisResult}
                    />
                </div>
                 <div className="lg:col-span-3 xl:col-span-4 hidden printable-area">
                     {currentReportForPrint && (
                        <div>
                             <h1 className="printable-title">Bio-Diagnostic Report: {new Date(currentReportForPrint.createdAt).toLocaleString()}</h1>
                             <div className="printable-panel">
                                <h2 className="printable-section-title">Integrated Plan & Synthesis</h2>
                                <div className="printable-content">
                                    <p><strong>Synthesis:</strong> {currentReportForPrint.analysisResult.integratedPlan.synthesis}</p>
                                    <p><strong>Recommendation:</strong> {currentReportForPrint.analysisResult.integratedPlan.recommendation}</p>
                                </div>
                             </div>
                             <div className="printable-panel">
                                <h2 className="printable-section-title">Academic Assessment</h2>
                                <div className="printable-content">
                                    <p><strong>Personality Profile:</strong> {currentReportForPrint.analysisResult.academicAnalysis.personality}</p>
                                    <p><strong>Future Effectiveness Index:</strong> {currentReportForPrint.analysisResult.academicAnalysis.futureEffectiveness}</p>
                                </div>
                            </div>
                             <div className="printable-panel">
                                <h2 className="printable-section-title">Physical Health Reading</h2>
                                 <div className="printable-content">
                                    <p><strong>BMI:</strong> {currentReportForPrint.analysisResult.healthAnalysis.bmi.toFixed(1)}</p>
                                    <p><strong>Status:</strong> {currentReportForPrint.analysisResult.healthAnalysis.bodyStatus}</p>
                                    <p><strong>Bio-Age Est:</strong> {currentReportForPrint.analysisResult.healthAnalysis.biologicalAge}</p>
                                    <p><strong>Cardio Efficiency:</strong> {currentReportForPrint.analysisResult.healthAnalysis.cardiovascularEfficiency}</p>
                                    {currentReportForPrint.analysisResult.healthAnalysis.dietPlan && <p><strong>Diet Plan:</strong> {currentReportForPrint.analysisResult.healthAnalysis.dietPlan}</p>}
                                    {currentReportForPrint.analysisResult.healthAnalysis.exercisePlan && <p><strong>Exercise Plan:</strong> {currentReportForPrint.analysisResult.healthAnalysis.exercisePlan}</p>}
                                 </div>
                            </div>
                             <div className="printable-panel">
                                <h2 className="printable-section-title">Neurological Assessment</h2>
                                 <div className="printable-content">
                                    <p><strong>Cognitive Function Assessment:</strong> {currentReportForPrint.analysisResult.neuroAnalysis.cognitiveFunctions}</p>
                                    <p><strong>Memory Assessment:</strong> {currentReportForPrint.analysisResult.neuroAnalysis.memoryAssessment}</p>
                                 </div>
                            </div>
                        </div>
                     )}
                </div>
                <div className="lg:col-span-3 xl:col-span-4 input-panel print-hide">
                     <div className="bg-[#0a0f18]/80 backdrop-blur-sm border-2 border-[#214d68] p-4 h-full">
                        <h2 className="text-lg font-bold text-[#2dffb5] text-glow uppercase mb-4">Integrated Plan & Synthesis</h2>
                        {isLoading && !analysisResult && <Loader />}
                        {analysisResult?.integratedPlan && (
                            <div className="space-y-4 text-sm text-gray-300">
                                <div>
                                    <h3 className="font-bold text-[#00f0ff] uppercase mb-1">Synthesis</h3>
                                    <p>{analysisResult.integratedPlan.synthesis}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#00f0ff] uppercase mb-1">Recommendation</h3>
                                    <p>{analysisResult.integratedPlan.recommendation}</p>
                                </div>
                            </div>
                        )}
                        {!isLoading && !analysisResult && <p className="text-gray-400">Analysis results will appear here after initiating a scan.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;