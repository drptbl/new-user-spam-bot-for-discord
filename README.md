# new-user-spam-bot-for-discord
Sends a custom message to each new user on server.<br>
Bot is not shown as "bot" in Discord - still uses old way of authentication.<br>
If all "bots" were banned, it uses `Twilio` to send an SMS notification about that.

`node_modules` are pushed to repo on purpose.<br>
I couldn't find old `discord.js` module anywhere - which were able to authenticate as normal user, not as bot.<br>
But I had it somewhere on my disk, so.. I've bundled it to the repo.

## How to use?
1. Clone the repo first
2. Check your settings in `data/options.json`
3. Create some new Discord accounts using any temporary e-mail provider which is not blacklisted by Discord, for example "www.niepodam.pl" (use your regional one)
4. Verify each account, login to Discord and join any server you want to spam and just forget about it
5. Fill your account details in `data/auth.json`
6. Start the bot using - `npm start` - and have fun!

It's still work in progress, main stuff is already completed.
