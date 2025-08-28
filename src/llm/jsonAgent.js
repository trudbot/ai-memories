import openai, { model, createOpenAIClient } from "./llm.js";
import { zodTextFormat } from "openai/helpers/zod";

export async function requestJsonOutput(systemPrompt, userInput, scheme) {
  const res = await openai.responses.parse({
    model,
    input: systemPrompt ? [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput }
    ] : [
      { role: "user", content: userInput }
    ],
    text: {
      format: zodTextFormat(scheme, 'event')
    }
  });
  return res.output_parsed;
}

// export async function requestJsonOutput(systemPrompt, userInput, scheme) {
//   const res = await deepseek.chat.completions.create({
//     model: "deepseek-chat",
//     messages: [
//       {role: "system", content: systemPrompt},
//       { role: "user", content: userInput }
//     ],
//     response_format: {
//         'type': 'json_object'
//     }
//   });
//   return res.choices[0].message.content;
// }