const messages = {
  general: {
    invalidId: (field: string) => `Not valid ${field} id!`,
    missingInputErr: "Some required inputs are missing!",
    missingFieldErr: (field: string) => `${field} is missing!`,
    invalidFieldErr: (value: string, field: string, fieldRegex?: string) =>
      `${value} is invalid ${field}!\n${fieldRegex}`,
    alreadyExistsFieldErr: (value: string, field: string) =>
      `${field} "${value}" already exists!`,
    fieldsRegex: {
      fullName: (minLength: number, maxLength: number) =>
        `The field length has to be between ${minLength} and ${maxLength}`,
      email:
        "Email should follow the correct email format 'username@example.com'",
      password:
        "Password should follow the following criteria:\n" +
        " 1- Password length has to be between 8 and 12\n" +
        " 2- Password can only contain upper and lower cases english alphabet, special characters including '@ $ ! % * ? &' in addition to english numbers.\n" +
        " 3- Password should contain at least one upper case character, one lower case character, one special character and one number.\n" +
        "Please try another one.",
    },
    unknownErr: "Something went wrong!",
  },
  auth: {
    missingTokenErr: "Access denied. No token provided.",
    tokenExpiredErr: "Token has expired please sign in again.",
  },
  users: {
    notMatchingPasswordsErr: "Passwords does't match please recheck!",
    userCreatedSuccess: (fullName: string) =>
      `Welcome to Agent Book ${fullName} :)`,
    invalidCredentialsErr: "Invalid credentials!",
    wrongPasswordErr: "Entered password is not correct!",
    userNotExistsErr: (field: string) =>
      `User with this ${field} doesn\'t exist!`,
    resetPasswordFailed: `Failed to reset password please try again.`,
    passwordUpdatedSuccess: "Password updated successfully try to login.",
  },
};

export default messages;
