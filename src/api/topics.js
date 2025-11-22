import { apiCall } from "./client";


export async function getAllTopics() {
    return apiCall("/topics/all", "GET");
}

