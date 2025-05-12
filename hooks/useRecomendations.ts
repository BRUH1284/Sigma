import * as recommendationsService from "@/services/recommendationsService";

export const useRecommendations = () => {
    return {
        rmrCalculator: recommendationsService.rmrCalculator,
        waterCalculator: recommendationsService.waterCalculator
    };
};