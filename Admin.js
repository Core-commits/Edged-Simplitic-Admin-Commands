const Ver = "V1.6.2"
const Developer = "Edge."

const ChatLogs = false
console.log(`Thanks for using Edged Admin Commands!\nCurrent Version: ${Ver}`)

const Admins = ["Edge.", "simulated_1", "Player1"]
const BannedUsers = []
const IPBANS = []
const SAFEIPS = ["127.0.0.1"]
const MessageLog = [];

Game.setMaxListeners(50) // Important to avoid future memory leaks

while (ChatLogs == true) {
    Game.on("playerJoin", (player) => {
        player.on("chatted", (message) => {
            MessageLog.push(`${player.username}: ${message}`)
            console.log(MessageLog)
            var filename = 'messagelog.txt';
            var str = JSON.stringify(MessageLog, null, 4);

            fs.writeFile(filename, str, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('File written!');
                }
            });
            // The player chatted.
        })
    })
}



function getPlayer(name) {
    for (let player of Game.players) {
        if (player.username.toLowerCase().indexOf(String(name).toLowerCase()) == 0) {
            const victim = Array.from(Game.players).find(p => p.username === player.username)
            return victim
        }
    }
}



function removeA(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function CheckAdmin(User) {
    if (Admins.includes(User)) {

        console.log(`${User} Is an administrator.`)
        return true;

    } else if (!Admins.includes(User)) {
        console.log(`${User} Is not an administrator`)
        return false;
    }

}




Game.on("playerJoin", (p) => {
    if (IPBANS.includes(p.socket.IPV4)) return p.kick("You are IP banned")
})

Game.command("ipban", (p, m) => {
    if (Admins.includes(p.username)) {
        const v = getPlayer(m);
        if (!v) return p.prompt("Player not found!");

        if (v.socket.IPV4 == p.socket.IPV4 || SAFEIPS.includes(v.socket.IPV4)) return p.message("Unable to IP ban. This IP is in the SAFEIPS array, or is your own IP.")

        IPBANS.push(v.socket.IPV4);
        BannedUsers.push(v.username)
        console.log(`You ip banned ${v.socket.IPV4}.`)
        for (let player of Game.players) {
            if (IPBANS.includes(player.socket.IPV4)) player.kick("You have been IP banned.")
        }
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("setavatar", (p, m) => {
    p.setAvatar(m)
    p.topPrint(`User: ${p.username} avatar is now ${m}`)

})
Game.command("setavatar", (p, m) => {
    p.setAvatar(m)
    p.topPrint(`User: ${p.username} avatar is now ${m}`)

})

Game.command("edge", (p, m) => {
    p.setAvatar(m)
    p.prompt(`Current Admin Version: ${Ver}\nDeveloper: ${Developer}\nThanks for using Edged Admin Commands!`)

})

Game.command("unipban", (p, ip) => {
    if (Admins.includes(p.username)) {
        if (IPBANS.includes(ip)) {
            IPBANS.splice(IPBANS.indexOf(ip), 1)
            console.log(`Unbanned IP: ${ip}`)
        }
    }
})

Game.command("size", (caller, args) => {
    if (Admins.includes(caller.username)) {
        args = args.split(" ")
        let P = getPlayer(args[0])
        console.log(caller.username + " is changing " + args[0] + " size to " + args[1])
        return P.setScale(new Vector3(P.scale.x = args[1], P.scale.y = args[1], P.scale.z = args[1]))
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("kick", (caller, args) => {
    if (Admins.includes(caller.username)) {
        for (let player of Game.players) {
            if (player.username.startsWith(args)) {
                return player.kick(`You were kicked by ${caller.username}`, 5)

            }

        }
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})


let Help = `Help Commands!\n
/ban Player || Bans the user from the server.\n
/kick Player || Kicks the player from the server.\n
/to Player || Teleports yourself to the player position\n
\n
Made by Edged. More Coming Soon.
`




Game.command("commands", (caller, args) => {
    if (Admins.includes(caller.username)) {
        console.log(Help)

    }
})

Game.command("change", (caller, args) => {
    if (Admins.includes(caller.username)) {
        args = args.split(" ")
        let P = getPlayer(args[0])
        console.log(caller.username + " is changing " + args[0] + " Score to " + args[1])
        return P.setScore(args[1])


    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5);
})


Game.command("alertall", (caller, args) => {
    if (Admins.includes(caller.username)) {
        for (let P of Game.players) {
            P.prompt(args)
        }

    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5);
})


Game.command("kill", (caller, args) => {
    if (Admins.includes(caller.username)) {
        args = args.split(" ")
        let P = getPlayer(args[0])
        if (args[0] == "all") {
            for (let player of Game.players) {
                player.setHealth(0)
                console.log(player.username + " has died")
            }
        } else return P.setHealth(0)


    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5);
})




Game.command("admin", (caller, args) => {
    if (Admins.includes(caller.username)) {
        if (caller.username == args) return caller.topPrint("You cant admin yourself again lol.")
        let P = getPlayer(args)
        caller.topPrint(`User ${P.username} is now an Administrator.`, 5)
        return Admins.push(P.username)
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})
Game.command("unadmin", (caller, args) => {
    if (Admins.includes(caller.username)) {
        if (caller.username == args) return caller.topPrint("You cant unadmin yourself.")
        let P = getPlayer(args)
        caller.topPrint(`User ${P.username} is no longer an administrator.`, 5)
        return Admins.splice(Admins.indexOf(P.username), 1)
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("m", (caller, args) => {
    if (Admins.includes(caller.username)) {
        Game.topPrintAll(`${args}`, 5)
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})
Game.command("n", (caller, args) => {
    if (Admins.includes(caller.username)) {
        Game.centerPrintAll(`${args}`, 5)
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("b", (caller, args) => {
    if (Admins.includes(caller.username)) {
        Game.bottomPrintAll(`${args}`, 5)
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})




Game.command("skydive", (caller, args) => {
    if (Admins.includes(caller.username)) {
        let P = getPlayer(args);
        if (args == "all") {
            for (let P of Game.players) {
                P.setPosition(new Vector3(P.position.x, P.position.y, P.position.z + 100))

            }
        }
        if (P == undefined || P == " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3)
        caller.topPrint(`Skydiving`, 3);
        CallerPos = caller.position;
        P.setPosition(new Vector3(P.position.x, P.position.y, P.position.z + 100))
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})



// Teleport Command
Game.command("to", (caller, args) => {
    if (Admins.includes(caller.username)) { // If the caller username is on the admin list.
        let P = getPlayer(args);
        if (P == undefined || P == " ") return caller.bottomPrint(`Player with the username key ${args} was not found on the server! Please try again.`, 3) //If the user doesnt exist....
        caller.topPrint(`Teleporting to ${P.username}`, 3);
        CallerPos = caller.position;
        caller.setPosition(new Vector3(P.position.x, P.position.y, P.position.z))
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5) // If he's not in the admin list return this.

})




Game.command("bring", (caller, args) => {
    let CallerPos = caller.position;
    if (Admins.includes(caller.username)) {
        let P = getPlayer(args);
        if (P.username == caller.username) return caller.topPrint("You cant Bring yourself!", 3)
        if (P == undefined || P == " ") return caller.bottomPrint("Player not found", 3)
        caller.topPrint(`Bringing Player ${P.username}`, 5)
        P.setPosition(new Vector3(CallerPos.x, CallerPos.y, CallerPos.z))


    }
    else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)




})




Game.command("ban", (caller, args) => {

    if (Admins.includes(caller.username)) {
        args = args.split(" ", 2)
        let P = getPlayer(args[0])

        if (caller.username == P.username) {
            return caller.topPrint("You cant ban yourself!")
        } else {
            caller.topPrint(`Banning user ${P.username}...`, 3)
            BannedUsers.push(P.username)
            P.kick(`You've been banned by ${caller.username}\nReason of Ban: ${args[1]} `)
        }
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("mute", (caller, args) => {
    if (Admins.includes(caller.username)) {
        let VICTIM = getPlayer(args)
        VICTIM.muted = true
        return caller.topPrint(`Player ${VICTIM.username} is now muted.`)

    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})

Game.command("mute", (caller, args) => {
    if (Admins.includes(caller.username)) {
        let VICTIM = getPlayer(args)
        VICTIM.muted = false
        return caller.topPrint(`Player ${VICTIM.username} is now unmuted.`)

    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})


Game.command("unban", (caller, args) => {
    if (Admins.includes(caller.username)) {
        if (BannedUsers.includes(args)) {
            removeA(BannedUsers, args)
            return caller.topPrint(`User ${args} is now Unbanned!`, 5)

        }
    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})




Game.command("shutdown", (caller, args) => {
    if (Admins.includes(caller.username)) {
        return game.shutdown()

    } else return caller.topPrint("You cant run that command! Missing privileges: Administrator", 5)

})




Game.on("playerJoin", (player) => {
    if (BannedUsers.includes(player.username)) {
        return player.kick("You're banned")
    }

    let sameIPs = Game.players.filter(p => p.socket.IPV4 === player.socket.IPV4)

    if (sameIPs.length > 1) {
        return player.kick("Your player IP is doubled. Please leave the game and rejoin in one single account.")
    }

})




Game.on("playerJoin", (player) => {

    if (Admins.includes(player.username)) {
        player.on("avatarLoaded", () => {
            return player.topPrint(`Welcome ${player.username} You're an administrator.`, 10)

        })


    }
})
