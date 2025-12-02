import { apiCall } from "./client";
export async function generateQuestion(payload){
    return apiCall('/recommendation/questions', "POST", payload)
}
