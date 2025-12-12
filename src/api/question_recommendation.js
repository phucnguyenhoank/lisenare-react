import { apiCall } from "./client";

export async function generateQuestion(payload) {
    try {
        const response = await apiCall('/recommendation/questions', "POST", payload);
        return response;
    } catch (error) {
        const message = error?.message || "Lỗi trong qua trinh sinh cau hoi, vui lòng thử lại";
        throw new Error("Sinh câu hỏi thất bại: " + message);
    }
}
