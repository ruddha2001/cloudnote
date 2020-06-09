import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import { prompt } from "enquirer";
import * as chalk from "chalk";
import { addNoteCloud, addNoteLocal } from "../controllers";
import { NoteObject, AddNoteResponseObject } from "../types";
import { errors } from "../constants";

export class Add extends Command {
  // Description of the command
  static description = "Add a new note";

  // Flags
  static flags = {
    offline: flags.boolean({
      char: "o",
      description: "Specifies note to be saved offline",
      hidden: false,
      required: false,
    }),
    secret: flags.boolean({
      char: "s",
      description: "Prevents the note body from being displayed in the console",
      hidden: false,
      required: false,
    }),
    multiline: flags.boolean({
      char: "m",
      description: "Enables multiline mode in body",
      hidden: false,
      required: false,
    }),
  };

  async run() {
    const { flags } = this.parse(Add);
    let response: AddNoteResponseObject = flags.offline
      ? await addNoteLocal(
          await this.inputNote(flags.multiline, flags.secret, flags.offline),
          "aniruddha"
        )
      : await addNoteCloud(
          await this.inputNote(flags.multiline, flags.secret, flags.offline),
          "aniruddha"
        );
    if (response.success) {
      if (flags.secret) response.note.body = "<Hidden>"; // Hides body for secret note
      console.log();
      console.log(response.message);
      cli.table([response.note], {
        title: {
          header: "Title",
          minWidth: 20,
        },
        body: {
          header: "Body",
        },
      });
    } else console.log(chalk.red.bold(response.message));
  }

  inputNote = async (
    multiline: boolean,
    secret: boolean,
    offline: boolean
  ): Promise<NoteObject> => {
    let addText = secret === true ? "secret " : "";
    let invisibleText =
      secret === true ? "secret note (invisible in console)" : "note";
    console.log(chalk.underline(`Adding a new ${addText}note`));

    // Offline mode check
    offline &&
      console.log(
        chalk.cyan("INFO: ") +
          "Offline mode for note is enabled. The note will be saved locally."
      );

    // Multiline mode check
    multiline &&
      console.log(
        chalk.cyan("INFO: ") +
          "Multiline mode for note body is enabled. Press enter for newline, press shift+enter to continue."
      );

    try {
      // Title of the note
      const { title } = await prompt({
        type: "input",
        name: "title",
        message: "What is the title?",
        validate: (value) => {
          return value.length > 0 ? true : "Title cannot be empty";
        },
      });

      // Body of the note
      const { body } = await prompt({
        type: secret === true ? "invisible" : "input",
        multiline: multiline,
        name: "body",
        message: `Write your ${invisibleText}`,
        validate: (value) => {
          return value.length > 0 ? true : "Note body cannot be empty";
        },
      });

      let note: NoteObject = {
        title: title,
        body: body,
      };
      return note;
    } catch (error) {
      console.log(chalk.cyan("ERROR: ") + errors.USER_CANCELLED.message);
      throw error;
    }
  };
}
