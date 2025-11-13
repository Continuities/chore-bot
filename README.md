# chore-bot

A Discord bot to coordinate household chores. Currently just for personal use.

## Environment setup

1. Install dependencies: `npm i`
2. Start the database: `docker compose --env-file .env.local up`
3. Run the bot: `npm run dev`

# Database

- Start with: `docker compose --env-file .env.local up`
- Connect with: `docker compose --env-file .env.local exec database mongosh`
