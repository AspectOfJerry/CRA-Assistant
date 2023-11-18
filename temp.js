for(const birthday of birthdays) {
    const channels = [];
    if(birthday.notes.includes("cra")) {
        channels.push(client.channels.resolve("1014293537363341332"));
    }

    const bday = new MessageEmbed()
    .setColor("GOLD")
    .setTitle(":tada: Happy birthday!")
    .setDescription(`:birthday: Happy Birthday to ${birthday.name} (<@${birthday.id}>)! :partying_face: Let's all wish them a fantastic day!`)
    .setFooter({text: `${dayjs().format("MMMM D, YYYY")}`});

    for(const channel of channels) {
        channel.send({content: `Happy birthday, <@${birthday.id}>!`, embeds: [bday]});
        logger.append("info", "CRON", `[Birthday] Wished ${birthday.name} a happy birthday in "#${channel.name}/${channel.guild.name}"!`);
    }
}