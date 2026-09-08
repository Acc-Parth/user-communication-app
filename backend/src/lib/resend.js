import {Resend} from "resend";
import {ENV} from "./env.js";

// Initialize the Resend client with the API key from environment variables
export const resendClient = new Resend(ENV.RESEND_API_KEY);

// Define the sender's email and name using environment variables
export const sender = {
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_FROM_NAME
}