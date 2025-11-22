import api from "@/services/api";
import { Endpoints } from "@/constants/endpoints";

export interface WeightJourneyPayload {
  goal: 'lose' | 'maintain' | 'gain';
  targetWeight: number;
  startingWeight: number;
  currentWeight: number;
  weeksSinceStart: number;
  weightChangeRate: 'mild' | 'moderate' | 'aggressive' | 'extreme';
  previousDailyCalories: number;
  adherenceRate: number;
  targetCompletion: string;
  timelineFlexibility: 'strict' | 'safety' | 'relaxed' | 'auto';
  priority: 'safety' | 'speed' | 'balanced' | 'adherence';
}

class WeightJourneyService {
  async save(userId: string | number, payload: WeightJourneyPayload) {
    const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    if (!numericUserId || Number.isNaN(numericUserId)) {
      throw new Error('Invalid userId');
    }
    const url = `${Endpoints.WEIGHT_JOURNEY.SAVE}/${numericUserId}`;
    const { data } = await api.post(url, payload);
    return data;
  }
}

export default new WeightJourneyService();



