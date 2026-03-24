import { GoogleGenAI, Type } from "@google/genai";
import type { AcademicData, HealthData, NeuroData, AnalysisResult } from '../types';
import { NEURO_QUESTIONS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getFullAnalysis(
    academicData: AcademicData,
    healthData: HealthData,
    neuroData: NeuroData
): Promise<AnalysisResult> {

    const formattedNeuroQs = NEURO_QUESTIONS.map(q => `- ${q.question} \n  Answer: ${neuroData[q.id]}`).join('\n');

    const prompt = `
        Analyze the following data for a secondary school student and provide a comprehensive, integrated report.

        **1. Academic Data (Grades out of 100):**
        ${Object.entries(academicData).map(([subject, grade]) => `- ${subject}: ${grade}`).join('\n')}

        **2. Physical Health Data:**
        - Gender: ${healthData.gender}
        - Height: ${healthData.height} cm
        - Weight: ${healthData.weight} kg

        **3. Neurological Assessment (Questions and Answers):**
        ${formattedNeuroQs}

        Based on all this data, generate a detailed analysis in the specified JSON format. The tone should be encouraging but direct, like a futuristic AI assistant.
        - For personality, analyze strengths and weaknesses based on grade distribution.
        - For future effectiveness, predict potential career paths or areas of societal contribution.
        - Calculate BMI and determine body status.
        - For the diet/exercise plan, be specific and actionable. If the BMI is normal, suggest a maintenance plan.
        - For neuro analysis, assess the provided answers for signs of strong or weak cognitive/memory functions.
        - For the integrated plan, synthesize all findings into a holistic summary and provide one key recommendation.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            academicAnalysis: {
                type: Type.OBJECT,
                properties: {
                    personality: { type: Type.STRING, description: "Personality analysis based on grades." },
                    futureEffectiveness: { type: Type.STRING, description: "Prediction of future effectiveness and potential career paths." },
                },
                required: ["personality", "futureEffectiveness"]
            },
            healthAnalysis: {
                type: Type.OBJECT,
                properties: {
                    bmi: { type: Type.NUMBER, description: "Calculated Body Mass Index." },
                    bodyStatus: { type: Type.STRING, description: "Body status: Underweight, Normal, Overweight, or Obese." },
                    cardiovascularEfficiency: { type: Type.STRING, description: "An assessment of cardiovascular efficiency." },
                    biologicalAge: { type: Type.STRING, description: "Predicted biological age based on health data." },
                    dietPlan: { type: Type.STRING, description: "A tailored diet plan. Optional." },
                    exercisePlan: { type: Type.STRING, description: "A tailored exercise plan. Optional." },
                },
                required: ["bmi", "bodyStatus", "cardiovascularEfficiency", "biologicalAge"]
            },
            neuroAnalysis: {
                type: Type.OBJECT,
                properties: {
                    cognitiveFunctions: { type: Type.STRING, description: "Assessment of cognitive functions." },
                    memoryAssessment: { type: Type.STRING, description: "Assessment of memory functions." },
                },
                required: ["cognitiveFunctions", "memoryAssessment"]
            },
            integratedPlan: {
                type: Type.OBJECT,
                properties: {
                    synthesis: { type: Type.STRING, description: "A holistic synthesis of all analyses." },
                    recommendation: { type: Type.STRING, description: "The primary recommended action plan or focus area." },
                },
                required: ["synthesis", "recommendation"]
            },
        },
        required: ["academicAnalysis", "healthAnalysis", "neuroAnalysis", "integratedPlan"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const result: AnalysisResult = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from the AI. The model may be temporarily unavailable.");
    }
}