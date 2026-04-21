'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import chatbotConfig from '../chatbot-config.json';
import { getCurrentUser } from '@/lib/auth-utils';

const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
    : null;

export async function askChatbot(message: string, history: { role: 'user' | 'model', content: string }[]) {
    const user = await getCurrentUser();
    
    // 1. Check for Rule-Based Fallback (Strong Match)
    const lowerMessage = message.toLowerCase();
    const faqMatch = chatbotConfig.faqs.find(f => 
        lowerMessage.includes(f.question.toLowerCase().replace('?', '')) ||
        f.question.toLowerCase().split(' ').every(word => lowerMessage.includes(word))
    );

    if (faqMatch && history.length < 2) {
        return { 
            role: 'model', 
            content: faqMatch.answer,
            source: 'FAQ'
        };
    }

    // 2. Try Gemini AI
    if (genAI) {
        // Model priority list - Updated to use the correct models available for this API key structure.
        // We prioritize newer models and lite versions that typically have distinct or higher free tier quotas.
        const modelsToTry = [
            'gemini-2.5-flash',
            'gemini-2.0-flash-lite', 
            'gemini-flash-lite-latest',
            'gemini-2.0-flash'
        ];
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    systemInstruction: chatbotConfig.systemPrompt + (user ? ` Current user is ${user.name || user.fullName || 'User'} (${user.role}).` : '')
                });

                // Gemini strictly requires history to start with a 'user' message.
                // We filter out any leading 'model' messages from the beginning of the history.
                let firstUserIndex = history.findIndex(h => h.role === 'user');
                const sanitizedHistory = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

                const chat = model.startChat({
                    history: sanitizedHistory.map(h => ({
                        role: h.role === 'user' ? 'user' : 'model',
                        parts: [{ text: h.content }]
                    })),
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                return { 
                    role: 'model', 
                    content: text,
                    source: `Gemini (${modelName})`
                };
            } catch (error: any) {
                console.error(`Gemini Error (${modelName}):`, error.message);
                lastError = error;
                // If the API key is completely invalid, we stop early.
                // However, for quota errors, we MUST continue to the next model because
                // Google grants separate quota limits per-model.
                if (error.message?.includes('API key not valid')) {
                    break;
                }
                continue;
            }
        }

        // Final fallback if all AI models failed or stopped early
        console.error('All Gemini model attempts failed:', lastError);
        return { 
            role: 'model', 
            content: "I'm having a bit of trouble reaching my advanced AI modules right now. However, I'm still here to help! Please try rephrasing your question or check back in a moment.",
            source: 'Fallback'
        };
    }

    // 3. Absolute Fallback (No API Key)
    return { 
        role: 'model', 
        content: faqMatch?.answer || "I'm currently in basic mode. Try asking about applications, country directors, or tracking your status!",
        source: 'Basic'
    };
}
