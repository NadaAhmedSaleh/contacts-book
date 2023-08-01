declare const createUser: (userObject: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
}) => Promise<{
    status: number;
    message: string;
}>;
declare const signIn: (userObject: {
    phoneNumber?: string;
    email?: string;
    password: string;
}) => Promise<{
    status: number;
    message?: string | undefined;
    accessToken?: string | undefined;
}>;
declare const forgetPassword: (email: string) => Promise<{
    status: number;
    message?: string | undefined;
    newToken?: string | undefined;
}>;
declare const resetPassword: (userInput: {
    email?: string;
    token?: string;
    userId?: string;
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string;
}) => Promise<{
    status: number;
    message: string;
}>;
export { createUser, signIn, forgetPassword, resetPassword };
