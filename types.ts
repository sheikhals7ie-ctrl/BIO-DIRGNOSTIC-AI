export type AcademicData = {
    [subject: string]: number;
};

export type HealthData = {
    height: number;
    weight: number;
    gender: 'male' | 'female';
};

export type NeuroQuestion = {
    id: string;
    question: string;
}

export type NeuroData = {
    [questionId: string]: string;
};

export interface AcademicAnalysis {
    personality: string;
    futureEffectiveness: string;
}

export interface HealthAnalysis {
    bmi: number;
    bodyStatus: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
    cardiovascularEfficiency: string;
    biologicalAge: string;
    dietPlan?: string;
    exercisePlan?: string;
}

export interface NeuroAnalysis {
    cognitiveFunctions: string;
    memoryAssessment: string;
}

export interface IntegratedPlan {
    synthesis: string;
    recommendation: string;
}

export interface AnalysisResult {
    academicAnalysis: AcademicAnalysis;
    healthAnalysis: HealthAnalysis;
    neuroAnalysis: NeuroAnalysis;
    integratedPlan: IntegratedPlan;
}

export interface Report {
    id: string;
    createdAt: string;
    academicData: AcademicData;
    healthData: HealthData;
    neuroData: NeuroData;
    analysisResult: AnalysisResult;
}