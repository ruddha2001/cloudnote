import { NoteObject, AddNoteResponseObject } from "../types";
import { errors } from "../constants";

export const addNoteCloud = (
  document: NoteObject,
  username: string
): AddNoteResponseObject => {
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
