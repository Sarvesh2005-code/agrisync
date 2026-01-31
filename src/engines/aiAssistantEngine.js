import { CROPS } from '../utils/constants';

// Offline Knowledge Base
const KNOWLEDGE_BASE = {
    en: {
        wheat: {
            sowing: "Wheat is best sown in November. Ensure soil moisture is adequate.",
            water: "Wheat requires 4-6 irrigations at critical stages like CRI (21 days).",
            fertilizer: "Apply NPK 120:60:40 kg/ha for optimal yield.",
            disease: "Watch out for Rusts (Yellow/Brown). use Propiconazole if detected."
        },
        rice: {
            sowing: "Rice nursery preparation starts in May-June.",
            water: "Maintain standing water of 2-5cm during reproductive stages.",
            disease: "Blast and Sheath Blight are common. Use Tricyclazole."
        },
        general: {
            weather: "I can't predict live weather yet, but check the home screen!",
            soil: "Soil testing every 3 years is recommended."
        }
    },
    hi: {
        wheat: {
            sowing: "गेहूं की बुवाई नवंबर में करें। मिट्टी में नमी सुनिश्चित करें।",
            water: "गेहूं को 4-6 सिंचाई की आवश्यकता होती है, विशेष रूप से सीआरआई (21 दिन) पर।",
            fertilizer: "अच्छी उपज के लिए NPK 120:60:40 किग्रा/हेक्टेयर डालें।",
            disease: "रतुआ रोग (पीला/भूरा) से सावधान रहें। प्रोपिकोनाज़ोल का प्रयोग करें।"
        },
        // Add more localized strings...
    }
};

export const AiAssistantEngine = {

    /**
     * Process user query and return an answer.
     * @param {string} query - The user's question.
     * @param {string} lang - Language code ('en', 'hi', 'mr').
     */
    ask: async (query, lang = 'en') => {
        // simulation delay
        await new Promise(r => setTimeout(r, 800));

        const q = query.toLowerCase();
        const kb = KNOWLEDGE_BASE[lang] || KNOWLEDGE_BASE['en'];

        // Simple keyword matching for "Offline AI"
        if (q.includes('wheat') || q.includes('गेहूं')) {
            if (q.includes('water') || q.includes('पानी')) return kb.wheat.water;
            if (q.includes('sow') || q.includes('बुवाई')) return kb.wheat.sowing;
            if (q.includes('fertilizer') || q.includes('खाद')) return kb.wheat.fertilizer;
            return kb.wheat.sowing + " " + kb.wheat.fertilizer;
        }

        if (q.includes('rice') || q.includes('धान')) {
            if (q.includes('water')) return kb.rice.water;
            return kb.rice.sowing;
        }

        // Default "AI" response for unknowns
        if (lang === 'hi') return "क्षमा करें, मुझे इसका उत्तर अभी नहीं पता है। कृपया किसी फसल (गेहूं/धान) के बारे में पूछें।";
        return "I'm learning! Ask me about Wheat, Rice, sowing dates, or fertilizers.";
    },

    getQuickActions: (lang = 'en') => {
        return [
            { id: 1, label: lang === 'hi' ? 'गेहूं की बुवाई?' : 'Wheat Sowing?', query: 'Wheat sowing' },
            { id: 2, label: lang === 'hi' ? 'धान में पानी?' : 'Rice Irrigation?', query: 'Rice water' },
            { id: 3, label: lang === 'hi' ? 'खाद की मात्रा?' : 'Fertilizer Dose?', query: 'Wheat fertilizer' },
        ];
    }
};
