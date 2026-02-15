
import { NextResponse } from 'next/server';

// This is the webhook endpoint that Retell AI / Vapi would call when a phone call is received.
// Documentation: https://docs.retellai.com/api-reference/agents/create-agent

interface InboundPayload {
    call_id: string;
    from_number: string;
    to_number: string; // The specific hotel's phone number
}

// MOCK DATABASE LOOKUP
const MOCK_HOTELS: Record<string, any> = {
    // Demo Hotel Number
    "+15125550198": {
        name: "Grand Austin Hotel",
        prompt_base: "You are the helpful front desk and room service AI for Grand Austin Hotel. Be polite, concise, and professional.",
        menu: [
            { item: "Club Sandwich", price: 18, modifiers: ["No Mayo", "Extra Bacon"] },
            { item: "Caesar Salad", price: 14, modifiers: ["Chicken", "Shrimp"] },
            { item: "Diet Coke", price: 4 },
        ]
    }
};

export async function POST(req: Request) {
    try {
        const payload: InboundPayload = await req.json();
        const hotel = MOCK_HOTELS[payload.to_number] || MOCK_HOTELS["+15125550198"]; // Fallback to demo

        if (!hotel) {
            // Reject call or play generic message if number not found
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }

        // DYNAMIC PROMPT CONSTRUCTION
        // We inject the specific hotel's menu and context into the system prompt securely.
        const systemPrompt = `
      ${hotel.prompt_base}
      
      Your goal is to take room service orders or answer questions about the hotel.
      
      Here is the Current Menu:
      ${JSON.stringify(hotel.menu, null, 2)}
      
      Rules:
      1. Always confirm the room number at the start.
      2. If ordering food, ask for any dietary restrictions.
      3. For "Club Sandwich", ask if they want white or wheat bread.
      4. If the user asks for something not on the menu, politely decline.
      
      You have access to the following tools:
      - place_order(room_number, items[])
      - check_availability(item_name)
      - transfer_to_human()
    `;

        // Return the configuration for this specific call session
        // This tells the Voice Provider (Retell/Vapi) how to behave involves standard LLM parameters.
        return NextResponse.json({
            agent_id: "agent_12345", // The base agent template ID
            llm_websocket_url: "wss://api.openai.com/v1/realtime", // Or your custom LLM proxy
            voice_id: "11labs-rachel", // ElevenLabs Voice ID
            system_prompt: systemPrompt,
            // Function Calling Definitions would go here normally
            tools: [
                {
                    type: "function",
                    name: "place_order",
                    description: "Place a room service order",
                    parameters: {
                        type: "object",
                        properties: {
                            room_number: { type: "string" },
                            items: { type: "array", items: { type: "string" } }
                        },
                        required: ["room_number", "items"]
                    }
                }
            ]
        });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
