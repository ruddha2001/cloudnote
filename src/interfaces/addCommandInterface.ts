export interface NoteObject {
  title: string;
  body: string;
}

export interface ResponseInterface {
  success: boolean;
  message: string;
  note: {
    title: string;
    body: string;
  };
}
