import { Document, Model } from "mongoose";
interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    tokenValidation?: string;
}
declare const User: Model<IUser>;
export default User;
export { IUser };
