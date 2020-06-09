import { readFileSync, writeFileSync } from "fs";
import cli from "cli-ux";
import * as chalk from "chalk";
import { prompt } from "enquirer";
import { NoteObject, AddNoteResponseObject } from "../types";
import { errors } from "../constants";
import { compileFunction } from "vm";

const readLocalNotes = () => {
  try {
    let dataBuffer = readFileSync("storage.json");
    let dataString = dataBuffer.toString();
    return <NoteObject[]>JSON.parse(dataString); // Array of all notes
  } catch (err) {
    return []; // Empty array if file is non-existent
  }
};

const saveLocalNotes = (notesArray: NoteObject[]): boolean => {
  try {
    const dataString = JSON.stringify(notesArray);
    writeFileSync("storage.json", dataString);
    return true;
  } catch (err) {
    return false;
  }
};

export const addNoteCloud = async (
  document: NoteObject,
  username: string
): Promise<AddNoteResponseObject> => {
  try {
    return {
      success: true,
      message: "The note was added successfully",
      note: {
        title: document.title,
        body: document.body,
      },
    };
  } catch (error) {
    let newError = errors.DB_INSERT_ERROR;
    return {
      success: newError.success,
      message: newError.message,
      note: {
        title: "",
        body: "",
      },
    };
  }
};

export const addNoteLocal = async (
  document: NoteObject,
  username: string
): Promise<AddNoteResponseObject> => {
  try {
    let notesArray = readLocalNotes();

    // Check for existing note
    let duplicateNotes = notesArray.filter(function (note) {
      return note.title === document.title;
    });

    if (duplicateNotes.length === 0) {
      notesArray.push({
        title: document.title,
        body: document.body,
      });
    } else {
      console.log(
        chalk.yellow("WARN: ") + "A note with the same title already exists."
      );
      let { choice } = await prompt({
        type: "confirm",
        name: "choice",
        message: "Do you wish to over-write it?",
      });
      if (!choice) throw new Error("choice");

      // Find index of duplicate note
      let index = -1;
      for (let i = 0; i < notesArray.length; i++) {
        if (notesArray[i].title === document.title) {
          index = i;
          break;
        }
      }
      // Delete the note
      notesArray.splice(index, 1);
      // Add the note
      notesArray.push({
        title: document.title,
        body: document.body,
      });
    }
    let result = saveLocalNotes(notesArray);
    if (!result) throw new Error();
    return {
      success: true,
      message: "The offline note was added successfully",
      note: {
        title: document.title,
        body: document.body,
      },
    };
  } catch (error) {
    let newError =
      error.message === "choice"
        ? errors.DUPLICATE_NOTE_ERROR
        : errors.LOCAL_WRITE_ERROR;
    return {
      success: newError.success,
      message: newError.message,
      note: {
        title: "",
        body: "",
      },
    };
  }
};
