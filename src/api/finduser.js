import { apiCall } from "./client";

export async function findUser(username) {
    const startTime = performance.now(); // bắt đầu đo

    try {
        const response = await apiCall(
            `/finduser/user?username=${username}`,
            "POST"
        );


        const endTime = performance.now(); // kết thúc đo
        console.log(`Request findUser took ${(endTime - startTime).toFixed(2)} ms`);

        return response;
    } catch (error) {
        const endTime = performance.now();
        console.log(`Request findUser failed after ${(endTime - startTime).toFixed(2)} ms`);
        throw error;
    }
}
