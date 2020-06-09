export const errors = {
  DB_INSERT_ERROR: {
    success: false,
    message: "The note could not be inserted into the database.",
  },
  LOCAL_WRITE_ERROR: {
    success: false,
    message: "The note could not be written locally.",
  },
  DUPLICATE_NOTE_ERROR: {
    success: false,
    message: "Overwrite permission for duplicate note was denied by the user",
  },
  FEATURE_LOCKED: {
    success: false,
    message: "This feature is locked/not supported in this version.",
  },
  USER_CANCELLED: {
    success: false,
    message: "User interuppted the operation",
  },
};
