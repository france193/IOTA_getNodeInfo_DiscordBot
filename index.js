const dotenv = require('dotenv');
const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('node-cron');
const request = require('request');

// check env settings
const result = dotenv.config();

if (result.error) {
	throw result.error
}

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

const cronSchedule = '* * * * *';
const ismb_node_url = process.env.FULL_NODE_URL;
const getNodeInfo_body = {
	"command": "getNodeInfo"
};
const headers = {
	'Content-Type': 'application/json',
	'X-IOTA-API-VERSION': '1.5.5'
};

// cron options
const cronOptions = {"scheduled": true, "timezone": "Europe/Rome"};

// cron jobs to do
const toExecute = async function () {
	const options = {
		headers: headers,
		url: ismb_node_url,
		json: getNodeInfo_body
	};

	request.post(options, function (error, response, body) {
		if (!error) {
			console.log("executed!");

			let latestMilestoneIndex = body.latestMilestoneIndex;
			let latestSolidSubtangleMilestoneIndex = body.latestSolidSubtangleMilestoneIndex;
			let sync = Number((latestSolidSubtangleMilestoneIndex / latestMilestoneIndex) * 100).toFixed(2);
			let time = body.time;

			const Message = "\n----------" +
				"NODE INFO:" +
				"\ntime: " + getTime(new Date(time)) +
				"\nlatestMilestoneIndex: " + latestMilestoneIndex +
				"\nlatestSolidSubtangleMilestoneIndex: " + latestSolidSubtangleMilestoneIndex +
				"\nsync: " + sync + " %" +
				"----------\n";

			client.channels.get(CHANNEL_ID).send(Message);
		}
	});
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	cron.schedule(cronSchedule, toExecute, cronOptions);
});

client.login(TOKEN).catch(function (e) {
	console.log(e);
});

function getTime(today) {
	let day = today.getUTCDate().toString().padStart(2, '0');
	//January is 0!
	let month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
	let year = today.getUTCFullYear();
	let hours = (today.getUTCHours() + 1).toString().padStart(2, '0');
	let minutes = today.getUTCMinutes().toString().padStart(2, '0');
	let seconds = today.getUTCSeconds().toString().padStart(2, '0');

	return hours + ':' + minutes + ':' + seconds + ' ' + day + '/' + month + '/' + year;
}
