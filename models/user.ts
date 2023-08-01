import mongoose, { Schema, Document, Model } from "mongoose";
import config from "config";
import messages from "../utils/message";

// Define the schema interface
interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  tokenValidation?: string;
}

// Create the schema
const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    fullName: {
      type: String,
      unique: true,
      validate: {
        validator: function isFullNameValid(v: string) {
          /**
           * the user name validation is:
           * - word length can be [5,30]
           */
          return new RegExp(config.get("regex.fullName")).test(v);
        },
        message: (props) =>
          messages.general.invalidFieldErr(
            props.value,
            "Full name",
            messages.general.fieldsRegex.fullName(5, 30)
          ),
      },
      required: [true, messages.general.missingFieldErr("Full name")],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function isValidEmail(v: string) {
          /**
           * the user name validation is:
           * - it includes an "@" symbol
           * - it has a domain name with at least two letters (such as ".com" or ".org")
           * - it doesn't include any invalid characters (such as spaces or special characters other than periods, underscores, percent signs, plus signs, or hyphens.)
           */
          return new RegExp(config.get("regex.email")).test(v);
        },
        message: (props) =>
          messages.general.invalidFieldErr(
            props.value,
            "email",
            messages.general.fieldsRegex.email
          ),
      },
      required: [true, messages.general.missingFieldErr("Email")],
      index: true,
    },
    password: {
      // the password validation is not done here as the one saved in db is hashed
      type: String,
      required: [true, messages.general.missingFieldErr("Password")],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function isValidPhoneNumber(v: string) {
          /**
           * some of the phone numbers that matches this regex:
           * - +1 123-456-7890
           * - 1 (123) 456-7890
           * - 123.456.7890
           * - 44 1234567890
           */
          return new RegExp(config.get("regex.phoneNumber")).test(v);
        },
        message: (props) =>
          messages.general.invalidFieldErr(props.value, "phone number"),
      },
    },
    tokenValidation: {
      // this is a random key that updated on logout and changing password to expire the old tokens
      type: String,
    },
  },
  { timestamps: true }
);

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
export { IUser };
