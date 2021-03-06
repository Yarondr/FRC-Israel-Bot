import { ApplicationCommand, CommandInteraction } from "discord.js"
import { IBot } from "../../utils/interfaces/IBot";
import { ISlashCommand } from "../../utils/interfaces/ISlashCommand";

module.exports = {
    name: "unregister",
    category: "Commands Manager",
    devOnly: true,
    description: "Unregister a command",
    permissions: ["ADMINISTRATOR"],
    botPermissions: ['SEND_MESSAGES'],
    options: [
        {
            name: 'command',
            description: "The command name to unregister",
            type: "STRING",
            required: true,
        }
    ],
    execute: async (bot: IBot, interaction: CommandInteraction) => {
        const { options } = interaction;
        const { slashCommands } = bot;
        const command = options.getString('command')!;

        try {
            await interaction.deferReply({ephemeral: true});
            if (!slashCommands.has(command)) {
                return interaction.editReply({content: "This command does not exist!"});
            } else {
                const cmd = slashCommands.get(command)!;
                const guild = interaction.guild;
                const guildCommands = await guild?.commands.fetch();
                const clientCommand: ApplicationCommand = guildCommands?.find(c => c.name === command)!;
                await guild?.commands.delete(clientCommand.id);
                slashCommands.delete(command);
                await interaction.editReply({content: `Command ${cmd.name} has been unregistered!`});
            }
        } catch (e) {
            console.error(e);
            try {
                return interaction.reply({content:"An error occurred while trying to unregister the command.", ephemeral: true});
            } catch (e) {
                return interaction.editReply("An error occurred while trying to unregister the command.");
            }
        }
    }
} as ISlashCommand;