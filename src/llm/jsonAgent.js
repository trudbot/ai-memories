import openai from "./llm.js";
import { zodTextFormat } from "openai/helpers/zod";

export async function requestJsonOutput(systemPrompt, userInput, scheme) {
  const res = await openai.responses.parse({
    model: "gpt-5-nano",
    input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
    ],
    text: {
        format: zodTextFormat(scheme, 'event')
    }
  });
  return res.output_parsed;
}