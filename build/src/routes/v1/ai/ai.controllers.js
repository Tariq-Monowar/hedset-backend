"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.askedQuestions = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new openai_1.default({
    apiKey: process.env.AI_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});
const askedQuestions = async (request, reply) => {
    try {
        const question = request.body?.question?.trim();
        if (!question) {
            return reply.status(400).send({
                success: false,
                message: "Missing or empty 'question' field in request body.",
            });
        }
        const response = await client.responses.create({
            model: "meta-llama/llama-4-maverick-17b-128e-instruct",
            temperature: 0.7,
            input: [
                {
                    role: "system",
                    content: `Your name is 'Hnge', but you are very angry and rude and uncivilized!`,
                },
                {
                    role: "user",
                    content: question,
                },
            ],
        });
        // console.log("============================",
        //   response.output)
        const aiMessage = response.output
            ?.flatMap((item) => item.type === "message" && item.role === "assistant"
            ? item.content
                ?.filter((c) => c.type === "output_text")
                ?.map((c) => c.text)
            : [])
            ?.join("\n")
            ?.trim() || "No response generated.";
        return reply.status(200).send({
            success: true,
            message: "AI response retrieved successfully!",
            data: aiMessage,
        });
    }
    catch (error) {
        console.error("Error in askedQuestions:", error);
        return reply.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
exports.askedQuestions = askedQuestions;
//# sourceMappingURL=ai.controllers.js.map