
# AI Concierge - Hotel Voice Assistant SaaS

This is a premium, plug-and-play Voice AI platform designed for hotels. It integrates with Clover POS and handles guest requests via natural conversation.

## 🚀 Features

- **Multi-Tenant SaaS**: Supports multiple hotels with unique phone numbers.
- **Dynamic Menu Sync**: Pulls menus from Website or Clover POS.
- **Voice Intelligence**: Simulates an AI that knows the specific hotel's context.
- **Live Order Dashboard**: Real-time view of incoming orders with status tracking.
- **Active Call Monitor**: Visualizes live calls with transcripts (Simulated).

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend API**: Next.js Server Actions / API Routes.
- **Voice Integration**: Designed for Retell AI or Vapi.ai (Webhooks implemented).
- **POS Integration**: Mock implementation for Clover API.

## 🏁 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Simulate Voice Calls (Local Testing)**:
    - Use `ngrok` to expose your local server: `ngrok http 3000`
    - Point your Retell/Vapi webhook URL to: `https://<your-ngrok-url>/api/voice/webhook`
    - Call your provisional phone number.

## 📂 Project Structure

- `src/app/page.tsx`: Main Dashboard (Metrics, Orders, Calls).
- `src/app/onboarding/page.tsx`: The "Plug & Play" setup wizard for clients.
- `src/components/ActiveCallMonitor.tsx`: The "Wow" factor visualization component.
- `src/api/integrations/clover/sync`: Logic to pull menu from POS.
- `src/api/voice/webhook`: The brain of the voice agent.

## 🔌 API Endpoints

- `POST /api/integrations/clover/sync`: Accepts `{ merchantId, apiKey }`. Returns normalized menu items.
- `POST /api/voice/webhook`: Accepts inbound call payload. Returns dynamic prompt + tools configuration.
