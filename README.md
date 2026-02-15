# AI Concierge - Hotel Voice Assistant SaaS

This is a premium, plug-and-play Voice AI platform designed for hotels. It integrates with Clover POS and handles guest requests via natural conversation.

## 🚀 Key Features

- **Multi-Tenant SaaS**: Supports multiple hotels with unique phone numbers.
- **Plug & Play Onboarding**: Hotels can sign up, enter a website URL, and instantly have a voice agent trained on their menu.
- **Dynamic Menu Sync**: Pulls menus from Website (Scraping) or Clover POS (API).
- **Voice Intelligence**: Simulates an AI that knows the specific hotel's context (Room Service, Amenities).
- **Live Order Dashboard**: Real-time view of incoming orders with status tracking (Supabase Realtime).
- **Active Call Monitor**: Visualizes live calls with transcripts (Simulated/Real).

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js Server Actions / API Routes.
- **Database**: Supabase (PostgreSQL) + Realtime.
- **Voice Integration**: Designed for Retell AI or Vapi.ai (Webhooks implemented).
- **POS Integration**: Mock implementation for Clover API.

---

## 🏁 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 📦 How to Use the App

### A. The Dashboard (Hotel View)
Navigate to `/` (Home).
-   **Order Feed**: Shows incoming orders. If Supabase is connected, these are real-time. If not, it simulates orders every 8 seconds for demo purposes.
-   **Active Call Monitor**: Visualizes a simulated voice conversation to demonstrate the AI's capabilities.

### B. Client Onboarding (The "SaaS" Flow)
Navigate to `/onboarding`.
1.  **Hotel Profile**: Enter a hotel name.
2.  **Connect Menu**:
    *   **Import from Website**: Enter a URL (e.g., `https://www.thecheesecakefactory.com/menu`) and click "Scrape". It will auto-detect menu items.
    *   **Connect Clover**: Enter a mock Merchant ID to simulate POS sync.
3.  **Voice Setup**: Choose a voice persona (Sarah, James, etc.) and generate a phone number.

### C. Menu Management
Navigate to `/menu`.
-   This is where hotel staff would update prices or mark items as "86'd" (Sold Out).
-   Changes here immediately update the Voice Agent's system prompt context.

---

## 🔌 Integrating Real Voice (Retell AI)

To make the AI actually talk, you need to connect a Voice Provider.

1.  **Expose Localhost**: Use ngrok to make your local API accessible to the internet.
    ```bash
    ngrok http 3000
    ```
2.  **Configure Retell AI**:
    *   Create a new Agent in Retell AI.
    *   Set the **LLM Websocket URL** or **Custom LLM Endpoint** to your ngrok URL:
        `https://<your-ngrok-id>.ngrok-free.app/api/voice/webhook`
3.  **Test Call**:
    *   Call the phone number assigned by Retell.
    *   The `route.ts` will receive the call, fetch the hotel's menu from Supabase (or mock), and instruct the AI on what to sell.

## 🗄️ Database Setup (Supabase)

1.  Create a new Supabase Project.
2.  Go to the **SQL Editor**.
3.  Copy and paste the contents of `supabase/schema.sql`.
4.  Run the query to create `hotels`, `menu_items`, and `orders` tables.

## 📂 Project Structure

- `src/app/page.tsx`: Main Dashboard (Metrics, Orders, Calls).
- `src/app/onboarding/page.tsx`: The "Plug & Play" setup wizard.
- `src/app/orders/page.tsx`: Dedicated Order Queue view.
- `src/api/integrations/web/scrape`: Cheerio script to scrape menus.
- `src/api/voice/webhook`: The "Brain" - handles incoming calls and context injection.
