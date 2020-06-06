import { ResponseInterface, NoteObject } from "./interfaces";
export const addNoteCloud = async (
  document: NoteObject
): Promise<ResponseInterface> => {
  return {
    success: true,
    message: "The note was added to the cloud",
    note: {
      title: document.title,
      body: document.body,
    },
  };
};
