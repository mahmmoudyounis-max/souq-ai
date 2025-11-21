import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Product } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

/**
 * Performs semantic search to find products matching a user's intent.
 * Returns a list of Product IDs.
 */
export const searchProductsWithAI = async (query: string, products: Product[]): Promise<number[]> => {
  if (!apiKey) {
    console.warn("API Key missing");
    return products.map(p => p.id);
  }

  const productContext = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.shortDescription,
    category: p.category
  }));

  const prompt = `
    You are an intelligent shopping assistant for an Arabic e-commerce store.
    User query: "${query}"
    
    Here is the product catalog:
    ${JSON.stringify(productContext)}
    
    Return a JSON object containing an array of "ids" of the products that are most relevant to the user's query.
    Consider synonyms, intent (e.g., "summer" -> t-shirt), and features.
    If nothing is relevant, return an empty array.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      ids: {
        type: Type.ARRAY,
        items: { type: Type.INTEGER }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const result = JSON.parse(jsonText);
    return result.ids || [];
  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};

/**
 * Generates a detailed, persuasive marketing description for a product in Arabic.
 */
export const generateProductMarketingCopy = async (product: Product): Promise<string> => {
  if (!apiKey) return "وصف تفصيلي غير متاح حالياً.";

  const prompt = `
    Write a compelling, sales-oriented product description in Arabic for the following item:
    Name: ${product.name}
    Category: ${product.category}
    Key Feature: ${product.shortDescription}
    
    The tone should be professional yet exciting. Keep it under 100 words.
    Do not include markdown formatting like bold or bullet points, just a clean paragraph.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "لا يمكن توليد الوصف حالياً.";
  } catch (error) {
    console.error("AI Description Error:", error);
    return "حدث خطأ أثناء توليد الوصف.";
  }
};

/**
 * Simple chat bot interaction
 */
export const chatWithShopAssistant = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
    if (!apiKey) return "عذراً، خدمة المساعد الذكي غير مفعلة.";

    try {
        // We construct a single turn or a simple chat structure manually if needed, 
        // but the new SDK handles history if we use chats.create. 
        // For simplicity in this functional component structure, we will use generateContent with context 
        // or a new chat instance each time (stateless for simplicity) or properly maintained chat object.
        // To keep it simple and robust:
        
        const systemInstruction = "أنت مساعد تسوق ذكي ومتعاون في متجر إلكتروني يسمى 'سوق AI'. تتحدث اللغة العربية بطلاقة وتساعد العملاء في اختيار المنتجات.";
        
        const chat = ai.chats.create({
            model: modelId,
            config: { systemInstruction },
            history: history // Pass previous history
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat Error:", error);
        return "عذراً، أواجه مشكلة تقنية حالياً.";
    }
}