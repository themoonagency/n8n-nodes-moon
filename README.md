# n8n-nodes-moon

n8n nodes for **MOON Chat** (AI sales chatbot for online shops and websites) and **MOON Post** (AI writer for blog and social media), by THE MOON Agency.

## Nodes

| Node | What it does |
|---|---|
| MOON Chat | Get leads, conversations (with messages), stats and the connected shop |
| MOON Chat Trigger | Starts a workflow on **New Lead** or **New Conversation** |
| MOON Post | Get posts (by status), get one post with full text, add a topic to the writing queue |
| MOON Post Trigger | Starts a workflow when a post is **published** |

## Credentials

Each product has its own API key, one per shop / account.

- **MOON Chat API**: in the MOON Chat panel, *Setări magazin → Notificări → API și integrări → Generează cheie*. Key starts with `mc_live_`.
- **MOON Post API**: in the MOON Post panel, *Setări → Conectare → API și integrări → Generează cheie*. Key starts with `mp_live_`.

The key is shown once. Generating a new one disables the old one; *Revoke* also removes the trigger webhooks.

## API docs

- MOON Chat: https://app.moonchat.ro/api/docs
- MOON Post: https://app.moonpost.ro/api/docs

## Example

New lead in MOON Chat → add a row in Google Sheets → send a Telegram message to the sales team.

## Support

contact@moonchat.ro · contact@moonpost.ro · https://themoonagency.ro

## License

MIT
