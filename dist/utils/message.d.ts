declare const messages: {
    general: {
        invalidId: (field: string) => string;
        missingInputErr: string;
        missingFieldErr: (field: string) => string;
        invalidFieldErr: (value: string, field: string, fieldRegex?: string) => string;
        alreadyExistsFieldErr: (value: string, field: string) => string;
        fieldsRegex: {
            fullName: (minLength: number, maxLength: number) => string;
            email: string;
            password: string;
        };
        unknownErr: string;
    };
    auth: {
        missingTokenErr: string;
        tokenExpiredErr: string;
    };
    users: {
        notMatchingPasswordsErr: string;
        userCreatedSuccess: (fullName: string) => string;
        invalidCredentialsErr: string;
        wrongPasswordErr: string;
        userNotExistsErr: (field: string) => string;
        resetPasswordFailed: string;
        passwordUpdatedSuccess: string;
    };
};
export default messages;
