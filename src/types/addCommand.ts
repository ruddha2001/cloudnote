export type NoteObject = {
  title: string;
  body: string;
};

export type AddNoteResponseObject = {
  success: boolean;
  message: string;
  note: {
    title: string;
    body: string;
  };
};
