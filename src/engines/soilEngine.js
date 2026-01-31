// Mock data for soil mapping
const SOIL_DATA = {
    'Maharashtra': {
        'Pune': {
            'sugarcane': 'Black Cotton Soil',
            'wheat': 'Loamy Soil'
        },
        'Nashik': {
            'grapes': 'Laterite Soil'
        }
    },
    'default': 'Alluvial Soil'
};

export const SoilEngine = {
    /**
     * Get soil details based on region and crop
     */
    getSoilInfo: (region, cropName) => {
        try {
            if (!region || !region.state || !region.district) {
                return SoilEngine.getSoilDetails(SOIL_DATA['default']);
            }

            const stateData = SOIL_DATA[region.state];
            if (stateData) {
                const districtData = stateData[region.district];
                if (districtData && districtData[cropName]) {
                    return SoilEngine.getSoilDetails(districtData[cropName]);
                }
            }
            return SoilEngine.getSoilDetails(SOIL_DATA['default']);

        } catch (e) {
            console.error(e);
            return SoilEngine.getSoilDetails(SOIL_DATA['default']);
        }
    },

    getSoilDetails: (soilType) => {
        // Return detailed properties
        return {
            type: soilType,
            ph: '6.5 - 7.5',
            nitrogen: 'Medium',
            phosphorus: 'High',
            potassium: 'Medium',
            moisture: '45%'
        };
    }
};
