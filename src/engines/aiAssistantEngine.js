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
        soil: {
            health: "To keep soil healthy: 1. Rotate crops (Legume-Cereal). 2. Use green manure (Sesbania). 3. Avoid excessive Urea.",
            testing: "Soil testing should be done every 3 years. Collect samples from 5 spots in a zig-zag pattern."
        },
        pest: {
            control: "Integrated Pest Management (IPM) is best. Use pheromone traps first. Spray chemicals only if pest population crosses Economic Threshold Level (ETL).",
            neem: "Neem oil (10000 ppm) is an effective organic pesticide for many sucking pests."
        },
        general: {
            weather: "I can't predict live weather yet, but check the home screen!",
            unknown: "I'm learning! Ask me about Wheat, Rice, Soil Health, or Pest Control."
        }
    },
    hi: {
        wheat: {
            sowing: "गेहूं की बुवाई नवंबर में करें। मिट्टी में नमी सुनिश्चित करें।",
            water: "गेहूं को 4-6 सिंचाई की आवश्यकता होती है, विशेष रूप से सीआरआई (21 दिन) पर।",
            fertilizer: "अच्छी उपज के लिए NPK 120:60:40 किग्रा/हेक्टेयर डालें।",
            disease: "रतुआ रोग (पीला/भूरा) से सावधान रहें। प्रोपिकोनाज़ोल का प्रयोग करें।"
        },
        soil: {
            health: "मिट्टी को स्वस्थ रखने के लिए: 1. फसल चक्र अपनाएं। 2. हरी खाद (ढैंचा) का प्रयोग करें। 3. यूरिया का अधिक प्रयोग न करें।",
        },
        // Add more localized strings...
    }
};

export const AiAssistantEngine = {

    ask: async (query, lang = 'en') => {
        // simulation delay
        await new Promise(r => setTimeout(r, 800));

        const q = query.toLowerCase();
        const kb = KNOWLEDGE_BASE[lang] || KNOWLEDGE_BASE['en'];

        // Voice/Image Simulations
        if (q.includes('analyzing_image_cmd')) {
            return lang === 'hi' ? "यह पत्ता स्वस्थ लग रहा है, लेकिन हल्का पीलापन नाइट्रोजन की कमी का संकेत हो सकता है।" : "This leaf looks mostly healthy, but slight yellowing suggests Nitrogen deficiency. Apply Urea.";
        }
        if (q.includes('voice_cmd_soil')) {
            return kb.soil.health;
        }

        // Knowledge Matching
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
        if (q.includes('soil') || q.includes('मिट्टी')) {
            return kb.soil.health;
        }
        if (q.includes('pest') || q.includes('कीट') || q.includes('neem')) {
            return kb.pest.control + " " + kb.pest.neem;
        }

        if (lang === 'hi') return "क्षमा करें, मुझे इसका उत्तर अभी नहीं पता है। कृपया गेहूँ/धान या मिट्टी के बारे में पूछें।";
        return kb.general.unknown;
    },

    getQuickActions: (lang = 'en') => {
        return [
            { id: 1, label: lang === 'hi' ? 'बुवाई कब करें?' : 'Sowing Date?', query: 'Wheat sowing' },
            { id: 2, label: lang === 'hi' ? 'मिट्टी का स्वास्थ्य?' : 'Soil Health?', query: 'How to keep soil healthy?' },
            { id: 3, label: lang === 'hi' ? 'कीट नियंत्रण?' : 'Pest Control?', query: 'How to control pests?' },
        ];
    }
};
