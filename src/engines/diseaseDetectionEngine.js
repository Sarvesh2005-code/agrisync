/**
 * diseaseDetectionEngine.js
 * 
 * Purpose: Diagnose plant diseases and pests based on symptoms
 * Features:
 * - Symptom-based disease matching
 * - Treatment recommendations (organic & chemical)
 * - Pest identification
 * - Nutrient deficiency detection
 * 
 * Data Source: diseases.json
 */

import DISEASES_DATA from '../data/diseases.json';

/**
 * Get all available crops in the disease database
 * @returns {Array<string>} - List of crop names
 */
export const getAvailableCrops = () => {
    return Object.keys(DISEASES_DATA).filter(crop => crop !== 'general');
};

/**
 * Get all diseases and pests for a specific crop
 * @param {string} cropName - Name of the crop (e.g., 'wheat', 'rice')
 * @returns {Array<Object>} - List of diseases/pests with details
 */
export const getDiseasesByCrop = (cropName) => {
    const cropData = DISEASES_DATA[cropName.toLowerCase()] || [];
    const generalData = DISEASES_DATA['general'] || [];
    return [...cropData, ...generalData];
};

/**
 * Search diseases by symptoms
 * @param {string} cropName - Name of the crop
 * @param {Array<string>} selectedSymptoms - List of observed symptoms
 * @returns {Array<Object>} - Matching diseases sorted by relevance
 */
export const diagnoseBySymptoms = (cropName, selectedSymptoms) => {
    const diseases = getDiseasesByCrop(cropName);

    if (!selectedSymptoms || selectedSymptoms.length === 0) {
        return diseases; // Return all if no symptoms selected
    }

    // Calculate match score for each disease
    const scoredDiseases = diseases.map(disease => {
        let matchCount = 0;
        const symptomsLower = disease.symptoms.map(s => s.toLowerCase());

        // Check how many selected symptoms match
        selectedSymptoms.forEach(selected => {
            const selectedLower = selected.toLowerCase();
            if (symptomsLower.some(s => s.includes(selectedLower) || selectedLower.includes(s))) {
                matchCount++;
            }
        });

        return {
            ...disease,
            matchScore: matchCount,
            matchPercentage: (matchCount / selectedSymptoms.length) * 100
        };
    });

    // Sort by match score (highest first)
    return scoredDiseases
        .filter(d => d.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Get common symptoms for a crop (for UI selection)
 * @param {string} cropName - Name of the crop
 * @returns {Array<string>} - List of unique symptoms
 */
export const getCommonSymptoms = (cropName) => {
    const diseases = getDiseasesByCrop(cropName);
    const allSymptoms = diseases.flatMap(d => d.symptoms);

    // Remove duplicates and return
    return [...new Set(allSymptoms)].sort();
};

/**
 * Get disease details by ID
 * @param {string} diseaseId - Unique disease identifier
 * @returns {Object|null} - Disease details or null if not found
 */
export const getDiseaseById = (diseaseId) => {
    for (const crop in DISEASES_DATA) {
        const disease = DISEASES_DATA[crop].find(d => d.id === diseaseId);
        if (disease) return disease;
    }
    return null;
};

/**
 * Get diseases by type (disease, pest, deficiency)
 * @param {string} cropName - Name of the crop
 * @param {string} type - Type filter ('disease', 'pest', 'deficiency')
 * @returns {Array<Object>} - Filtered list
 */
export const getDiseasesByType = (cropName, type) => {
    const diseases = getDiseasesByCrop(cropName);
    return diseases.filter(d => d.type === type);
};

/**
 * Get emergency contact info for severe cases
 * @returns {Object} - Contact information
 */
export const getEmergencyContacts = () => {
    return {
        krishi_vigyan_kendra: {
            name: "Krishi Vigyan Kendra (KVK)",
            number: "1800-180-1551",
            description: "Agricultural extension center for expert advice"
        },
        kisan_call_center: {
            name: "Kisan Call Center",
            number: "1800-180-1551",
            description: "24/7 helpline for farmers (toll-free)"
        },
        state_agriculture_dept: {
            name: "State Agriculture Department",
            description: "Contact your local agriculture office"
        }
    };
};

/**
 * Get preventive tips for a crop
 * @param {string} cropName - Name of the crop
 * @returns {Array<string>} - List of preventive measures
 */
export const getPreventiveTips = (cropName) => {
    const tips = {
        wheat: [
            "Use certified disease-free seeds",
            "Maintain proper plant spacing for air circulation",
            "Avoid excessive nitrogen fertilizer",
            "Practice crop rotation with legumes",
            "Remove and burn crop residue after harvest"
        ],
        rice: [
            "Maintain 2-5cm standing water during reproductive stage",
            "Use resistant varieties like Swarna, IR64",
            "Avoid deep water submergence",
            "Remove weeds regularly",
            "Use balanced NPK fertilization"
        ],
        cotton: [
            "Grow Bt cotton varieties for bollworm resistance",
            "Install pheromone traps for pest monitoring",
            "Practice intercropping with marigold or maize",
            "Avoid waterlogging in field",
            "Monitor for pests weekly"
        ],
        general: [
            "Conduct soil testing every 3 years",
            "Use organic manure to improve soil health",
            "Practice Integrated Pest Management (IPM)",
            "Maintain field hygiene",
            "Use drip irrigation to prevent fungal diseases"
        ]
    };

    return tips[cropName.toLowerCase()] || tips.general;
};

export default {
    getAvailableCrops,
    getDiseasesByCrop,
    diagnoseBySymptoms,
    getCommonSymptoms,
    getDiseaseById,
    getDiseasesByType,
    getEmergencyContacts,
    getPreventiveTips
};
