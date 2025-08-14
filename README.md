# 🌿 Dobby Prompt Generator – Run Locally

<img width="138" height="139" alt="Screenshot from 2025-08-14 17-35-17" src="https://github.com/user-attachments/assets/149dc19e-33c4-4d86-8782-8510249a0bc0" />

Meet your **Dobby Prompt Generator** — a Discord bot that helps you:

- Brainstorm and **enhance rough ideas** into polished prompts  
- **Rewrite** or **expand** short notes into detailed creative briefs  
- Craft **image prompts** or **story starters** in your favorite styles  
- Use the **Dobby model** on Fireworks AI for fast, high-quality results  

> Built with **Node.js (18+)** and **discord.js v14**. Uses Fireworks Chat Completions behind the scenes.

---

## ✨ Commands (default prefix: `!`)

<img width="579" height="74" alt="Screenshot from 2025-08-14 16-27-57" src="https://github.com/user-attachments/assets/281bc6cb-f5ff-4fd9-9888-22191762acf1" />
<img width="615" height="196" alt="Screenshot from 2025-08-14 16-28-09" src="https://github.com/user-attachments/assets/4536a132-d5d9-44fa-aee1-27622a7e85e7" />


- `!prompt <idea>` — Turn a short idea into a rich, structured prompt (tone, style, constraints)  
- `!rewrite <text>` — Improve clarity and flow while keeping meaning  
- `!expand <seed>` — Grow a seed thought into a multi-section outline  
- `!imageprompt <concept>` — Generate a concise image prompt  
- `!styleguide` — Show available tones, styles, and formats  
- `!help` — Show usage and examples  

> Tip: You can customize prefix & bot name in `.env`.

---

## 🧩 How it works

1. The bot listens for messages with your prefix (e.g., `!prompt`).  
2. It builds a **prompt template** with your preferences (tone, length, format).  
3. It calls the **DOBBY AI Chat Completions API** using the **Dobby model 70b**.  
4. Long outputs are **chunked** so they fit Discord’s message limits.  
<img width="625" height="474" alt="Screenshot from 2025-08-14 16-28-22" src="https://github.com/user-attachments/assets/9c80ac21-841a-40b1-beac-ec85c0b8dd7b" />


---

## 🛠️ Prerequisites

- **Node.js 18+** (includes native `fetch`)  
- A **Discord Application** with a Bot user (from <https://discord.com/developers/applications>)  
- A **Fireworks AI API Key** (from <https://app.fireworks.ai>)  

Enable **MESSAGE CONTENT INTENT** in your bot settings.

---

## 🚀 Install & Run

### 1) Clone and install

