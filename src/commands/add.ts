import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import { prompt } from "enquirer";
import { boolean } from "@oclif/command/lib/flags";
import * as chalk from "chalk";
import {
  addNoteCloud,
  ResponseInterface,
  NoteObject,
} from "../functionalities";

export class Add extends Command {
  static description = "Add a new note";
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
    let response = flags.offline
      ? {
          success: false,
          message: "This feature is locked/not supported in this version",
          note: {
            title: null,
            body: null,
          },
        }
      : await addNoteCloud(
          flags.secret
            ? await this.secretInput(flags.multiline)
            : await this.normalInput(flags.multiline) //Secret Note check
        ); // Note type check
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

  normalInput = async (multiline: boolean): Promise<NoteObject> => {
    console.log(chalk.underline("Adding a new note"));
    multiline &&
      console.log(
        chalk.cyan("INFO: ") +
          "Multiline mode for node body is enabled. Press enter for newline, press shift+enter to continue"
      );
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
      type: "input",
      multiline: multiline,
      name: "body",
      message: "Write your note",
      validate: (value) => {
        return value.length > 0 ? true : "Note body cannot be empty";
      },
    });
    let note = {
      title: title,
      body: body,
    };
    return note;
  };

  secretInput = async (multiline: boolean): Promise<NoteObject> => {
    console.log(chalk.underline("Adding a new secret note"));
    multiline &&
      console.log(
        chalk.cyan("INFO: ") +
          "Multiline mode for note body is enabled. Press enter for newline, press shift+enter to continue"
      );
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
      type: "invisible",
      multiline: multiline,
      name: "body",
      message: "Write your secret note (invisible in console)",
      validate: (value) => {
        return value.length > 0 ? true : "Note body cannot be empty";
      },
    });
    let note = {
      title: title,
      body: body,
    };
    return note;
  };
}
