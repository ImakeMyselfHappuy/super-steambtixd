const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const config = require('./config.json');
const client = new SteamUser();


const logOnOptions = {
  accountName: config.username,
  password: config.password,
  twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
  console.log('Logged into Steam, now idling!');
  client.setPersona(SteamUser.Steam.EPersonaState.Online);
  client.gamesPlayed(["Idling 24/7 - chaos", 429780]);
});

client.on("friendMessage", function(steamID, message) {
	if (message = "hi") {
		client.chatMessage(steamID, "Hello, this is my idle account made by chaos! feel free to add me or my owner.");
	}
});


client.on('friendRelationship', function(sid, relationship) {
	if (relationship == SteamUser.EFriendRelationship.RequestRecipient) {
		console.log("We recieved a friend request from "+sid);
		client.addFriend(sid, function (err, name) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("Accepted user with the name of "+name)
		})
	}

})

client.on('groupRelationship', function(sid, relationship) {
	if (relationship == SteamUser.EClanRelationship.Invited) {
		console.log("We were asked to join steam group #"+sid);
		client.respondToGroupInvite(sid, true);
	}
})

client.on('friendsList', function() {
	for (var sid in client.myFriends);
		var relationship = client.myFriends[sid]
		if (relationship == SteamUser.EFriendRelationship.RequestRecipient) {
		console.log("(offline) We recieved a friend request from "+sid);
		client.addFriend(sid, function (err, name) {
			if (err) {
				console.log(err);
				return;
			}
			console.log("(offline) Accepted user with the name of "+name)
		})
	}
})

client.on('groupList', function() {
	for (var sid in client.myGroups);
		var relationship = client.myGroups[sid];
		if (relationship == SteamUser.EClanRelationship.Invited) {
		console.log("(offline) We were asked to join steam group #"+sid);
		client.respondToGroupInvite(sid, true);
	}

});
