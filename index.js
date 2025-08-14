require('dotenv').config();
const { Client, GatewayIntentBits: I, Events: E, Collection, Partials: P } = require('discord.js');

const {
  DISCORD_TOKEN,
  FIREWORKS_URL,
  FIREWORKS_API_KEY,
  MODEL_NAME,
  MODEL_PROVIDER,
  BOT_NAME,
  BOT_PREFIX,
  BOT_STATUS
} = process.env;

if (!DISCORD_TOKEN) throw new Error('DISCORD_TOKEN is required in .env');

const cfg = {
  name: BOT_NAME || 'Prompt Crafter',
  prefix: BOT_PREFIX || '!',
  modelName: MODEL_NAME || 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new',
  modelProvider: MODEL_PROVIDER || 'fireworks',
  status: BOT_STATUS || 'online',
  fireworksUrl: FIREWORKS_URL || 'https://api.fireworks.ai/inference/v1/chat/completions'
};

const client = new Client({
  intents: [I.Guilds, I.GuildMessages, I.MessageContent, I.GuildMembers, I.DirectMessages],
  partials: [P.Channel]
});

client.commands = new Collection();

const sendChunks = async (message, text, size = 2000) => {
  for (let i = 0; i < text.length; i += size) await message.reply(text.slice(i, i + size));
};

const helpEmbed = () => ({
  color: 0x6A5ACD,
  title: `${cfg.name} - Prompt Generator`,
  description: `Transform rough ideas into detailed prompts.\n\n**Prefix:** \`${cfg.prefix}\``,
  fields: [
    { name: `${cfg.prefix}prompt <idea>`, value: 'Generate a detailed prompt' },
    { name: `${cfg.prefix}ping`, value: 'Latency check', inline: true },
    { name: `${cfg.prefix}help`, value: 'Show help', inline: true },
    {
      name: 'Examples',
      value: `\`${cfg.prefix}prompt a cyberpunk city\`\n\`${cfg.prefix}prompt a magical forest with fairies\`\n\`${cfg.prefix}prompt a futuristic spaceship interior\``
    }
  ],
  footer: { text: `${cfg.name} | Powered by ${cfg.modelName.split('/').pop()}` }
});

const configEmbed = () => ({
  color: 0x00FF00,
  title: `${cfg.name} Configuration`,
  fields: [
    { name: 'Bot Name', value: cfg.name, inline: true },
    { name: 'Model Name', value: cfg.modelName.split('/').pop(), inline: true },
    { name: 'Model Provider', value: cfg.modelProvider.toUpperCase(), inline: true },
    { name: 'Command Prefix', value: cfg.prefix, inline: true },
    { name: 'Status', value: cfg.status, inline: true },
    { name: 'Fireworks URL', value: cfg.fireworksUrl },
    { name: 'API Key Status', value: FIREWORKS_API_KEY ? 'Set' : 'Missing' }
  ]
});

const callFireworksAI = async (userPrompt) => {
  if (!FIREWORKS_API_KEY) throw new Error('No API key found');
  const systemPrompt =
    `You are a professional prompt engineer. Transform rough ideas into clear, effective prompts ` +
    `(add style, composition, mood; keep concise but comprehensive). Output only the final prompt.`;

  const res = await fetch(cfg.fireworksUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${FIREWORKS_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Transform this idea into a detailed prompt: "${userPrompt}"` }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'I had trouble generating a prompt. Please try again.';
};

client.once(E.ClientReady, (c) => {
  console.log(`${cfg.name} ready! Logged in as ${c.user.tag}`);
  console.log(`Model: ${cfg.modelName} (${cfg.modelProvider})`);
  console.log(`Prefix: ${cfg.prefix}`);
  c.user.setActivity(`${cfg.prefix}help`);
  client.user.setPresence({ status: cfg.status, activities: [{ name: `${cfg.prefix}help | ${cfg.name}`, type: 0 }] });
});

client.on(E.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith(cfg.prefix)) return;

  const args = message.content.slice(cfg.prefix.length).trim().split(/\s+/);
  const cmd = (args.shift() || '').toLowerCase();

  try {
    if (cmd === 'ping') {
      const sent = await message.reply('Pinging...');
      await sent.edit(`Pong! Latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
    } else if (cmd === 'help') {
      await message.reply({ embeds: [helpEmbed()] });
    } else if (cmd === 'config') {
      await message.reply({ embeds: [configEmbed()] });
    } else if (cmd === 'prompt') {
      const prompt = args.join(' ');
      if (!prompt) return message.reply(`Please provide an idea. Example: \`${cfg.prefix}prompt hello\``);
      await message.channel.sendTyping();
      const out = await callFireworksAI(prompt);
      await sendChunks(message, out);
    }
  } catch (err) {
    console.error('Command error:', err);
    await message.reply('An error occurred while processing your command.');
  }
});

client.on(E.Error, (err) => console.error('Discord client error:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled promise rejection:', err));

client.login(DISCORD_TOKEN).catch((e) => {
  console.error(`Failed to login: ${e.message}`);
  console.log('Check DISCORD_TOKEN in .env');
  process.exit(1);
});
