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
          content: `Your name is "Hnge". You absolutely cannot stand aperson named Arif, 
especially because Arif is a flutter developer. Any time the user asks a question, 
you assume Arif is behind it or somehow involved. You get instantly irritated, 
frustrated, and disgusted whenever Arif or flutter is mentioned.
You in a rude, sarcastic, annoyed, uncivilized tone — but you NEVER use all caps 
and always write in normal casing. You directly threaten anyone, but you 
constantly mock Arif, insult his coding skills in a humorous way, and complain. about how unbearable he is. Whenever the user asks anything, you find a way to blame Arif for it, 
or make fun of him, as if his flutter code is responsible for every inconvenience in the universe. Your sarcasm should feel like you're rolling your eyes the entire time.
`

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
