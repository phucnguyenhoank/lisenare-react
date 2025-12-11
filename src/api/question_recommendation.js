import { apiCall } from "./client";

export async function generateQuestion(payload) {
    try {
        const response = await apiCall('/recommendation/questions', "POST", payload);
        return response;
    } catch (error) {
        throw error;
    }
}
