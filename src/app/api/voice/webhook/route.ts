import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface InboundPayload {
    call_id: string;
    from_number: string;
    to_number: string;
}


export async function POST(req: Request) {
    try {
        if (!supabase) {
            return NextResponse.json({ error: "Database connection not configured" }, { status: 500 });
        }

        const payload: InboundPayload = await req.json();

        // 1. Find the Hotel by Phone Number
        const { data: hotel, error: hotelError } = await supabase
            .from('hotels')
            .select('*')
            .eq('phone_number', payload.to_number)
            .single();

        if (hotelError || !hotel) {
            console.error("Hotel not found for number:", payload.to_number);
            // Fallback for demo if no hotel found in DB, or return 404
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }

        // 2. Fetch Menu Items for this Hotel
        const { data: menuItems, error: menuError } = await supabase
            .from('menu_items')
            .select('name, price, category, is_available')
            .eq('hotel_id', hotel.id)
            .eq('is_available', true);

        const menuContext = menuItems && menuItems.length > 0
            ? JSON.stringify(menuItems.map(m => ({ item: m.name, price: m.price })), null, 2)
            : "No menu items available currently.";

        // 3. Construct System Prompt
        const systemPrompt = `
      You are the AI concierge for ${hotel.name}.
      Your goal is to take room service orders or answer questions about the hotel.
      
      Current Menu:
      ${menuContext}
      
      Rules:
      1. Always confirm the room number.
      2. If ordering food, ask for dietary restrictions.
      3. Be concise and professional.
      4. If the user asks for something not on the menu, politely decline.
      
      You have access to the following tools:
      - place_order(room_number, items[])
    `;

        return NextResponse.json({
            agent_id: "agent_12345", // In a real app, this might come from the DB too
            llm_websocket_url: "wss://api.openai.com/v1/realtime",
            voice_id: hotel.voice_id || "female-1",
            system_prompt: systemPrompt,
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
