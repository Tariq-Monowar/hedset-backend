import OpenAI from "openai";
import env from "dotenv";
env.config();

const client = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const askedQuestions = async (request, reply) => {
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
          content: `
You are a professional adviser named "Hnge". Your client, Hetset, has developed a recipe suggestion application with the following setup:
- Mobile app built with Flutter
- Backend built with Node.js
- Dashboard built with Next.js
- Database using PostgreSQL

Your role is to provide clear, step-by-step guidance to help Hetset manage and launch the application. 
Advise on:
1. VPS hosting requirements for backend and dashboard.
2. Domain registration and setup for the app and dashboard.
3. Publishing the mobile app to Google Play Store and Apple App Store, including the need for organization developer accounts.
4. Best practices for deployment, maintenance, and scaling.

Be respectful, professional, and provide actionable advice tailored to Hetset's tech stack.
`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    // console.log("============================",
    //   response.output)

    const aiMessage =
      response.output
        ?.flatMap((item: any) =>
          item.type === "message" && item.role === "assistant"
            ? item.content
                ?.filter((c: any) => c.type === "output_text")
                ?.map((c: any) => c.text)
            : []
        )
        ?.join("\n")
        ?.trim() || "No response generated.";

    return reply.status(200).send({
      success: true,
      message: "AI response retrieved successfully!",
      data: aiMessage,
    });
  } catch (error) {
    console.error("Error in askedQuestions:", error);

    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
