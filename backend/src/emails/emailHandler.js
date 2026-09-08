import {resendClient, sender} from "../lib/resend.js";
import {welcomeEmailTemplate} from "./emailTemplate.js";

// Function to send a welcome email to the new user
export const sendWelcomeEmail = async (recipientEmail, recipientName, clientURL) => {
    // Use the Resend client to send the email
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: recipientEmail,
        subject: "Welcome to Commify - Your Messaging Platform",
        html: welcomeEmailTemplate(recipientName, clientURL)
    });
    if(error){
        console.error("Error sending welcome email:", error);
    }
    console.log("Welcome email sent successfully:", data);
}