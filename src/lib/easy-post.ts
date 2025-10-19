import EasyPostClient from "@easypost/api";

// TODO: We could add a env validator to ensure we have the necessary variables
// For now, assuming we have them is fine
export const easyPost = new EasyPostClient(process.env.EASYPOST_API_KEY!);
