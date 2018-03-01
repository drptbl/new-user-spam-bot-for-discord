// todo: refactor
// todo: wait around 5 minutes before changing account to new one after getting banned? (just in case to avoid another instant ban from admins)
// todo: verify discord new login location automatically using e-mail API (can't be done if there's a captcha?)
// todo: throw errors instead of using process.exit()

const fs = require('fs');
const Discord = require('discord.js');
const smsProvider = require('twilio');

const options = require('./data/options.json');
const AuthDetails = require(options.authFilePath);

const bot = new Discord.Client();
const accountDetails = AuthDetails[AuthDetails.currentAccount];

let sentToCount = 0;
let serversConnectedCount = 0;

if (accountDetails === undefined) {
    console.log('There are no more accounts left in auth.json file. Please add new ones.');

    if (options.smsSetup.sendSMS && !AuthDetails.smsSent) {
        const sms = smsProvider(options.smsSetup.twilioSid, options.smsSetup.twilioAuthToken);
        sms.messages.create({
            to: options.smsSetup.sendTo,
            from: options.smsSetup.sendFrom,
            body: options.smsSetup.sendTextBody
        }).then(() => {
            AuthDetails.smsSent = true;
            fs.writeFile(options.authFilePath, JSON.stringify(AuthDetails, null, 2), (err) => {
                if (err) {
                    console.log('There was an error while saving updated file after sending sms: ', err);
                    process.exit(1);
                } else {
                    console.log('SMS sent!');
                    process.exit(1);
                }
            });
        }).catch((err) => {
            console.log('There was an error while sending sms: ', err);
            process.exit(1);
        });
    } else if (options.smsSetup.sendSMS && AuthDetails.smsSent) {
        console.log('SMS already sent before. Waiting for user action.');
        process.exit(1);
    } else {
        console.log('Doing nothing more. Waiting for user action.');
        process.exit(1);
    }
} else {
    bot.on('ready', () => {
        console.log('Lets begin!');
        console.log(`Serving in ${bot.servers.length} server(s) and ${bot.channels.length} channel(s) as user ${accountDetails.email}`);
        checkIfConnectedToServers(options.connectedServersAmount);
    });

    bot.on('serverNewMember', (server, user) => {
        const randNum = Math.floor(Math.random() * (options.sendMessageWaitTime.max - options.sendMessageWaitTime.min + 1)) + options.sendMessageWaitTime.min;

        console.log(`Sending message to: ${user.username}..`);

        setTimeout(() => {
            bot.sendMessage(user, options.sendMessageContent);
            console.log(`Message sent to: ${user.username}. Time waited: ${randNum}`);
            sentToCount++;
            console.log(`Messages sent overall count: ${sentToCount}`);
        }, randNum);
    });

    bot.on('disconnected', () => {
        console.log('Disconnected!');
        process.exit(1);
    });

    bot.login(accountDetails.email, accountDetails.password);
}

function checkIfConnectedToServers(amount) {
    setInterval(() => {
        serversConnectedCount = bot.servers.length;
        if (serversConnectedCount < amount) {
            console.log(`Looks like we are banned on account with e-mail ${accountDetails.email}, marking account as banned..`);
            accountDetails.banned = true;
            AuthDetails.currentAccount++;
            fs.writeFile(options.authFilePath, JSON.stringify(AuthDetails, null, 2), (err) => {
                if (err) {
                    console.log('There was an error while saving updated file: ', err);
                    process.exit(1);
                } else {
                    console.log('Account marked with success! Changing account to next one..');
                    process.exit(1);
                }
            });
        }
    }, options.banCheckInterval);
}