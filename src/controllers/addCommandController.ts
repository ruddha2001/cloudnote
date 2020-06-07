import { NoteObject, ResponseInterface } from "../interfaces";
import { errors } from "../constants";
import { networkInterfaces } from "os";

export const addNoteCloud = (
  document: NoteObject,
  username: string
): ResponseInterface => {
  try {
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
  return {
    success: true,
    message: "The note was added successfully",
    note: {
      title: document.title,
      body: document.body,
    },
  };
};
