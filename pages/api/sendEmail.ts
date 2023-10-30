import type { NextApiRequest, NextApiResponse } from "next";
import {
  InviteUserEmailTemplate,
  MoneySentTemplate,
} from "../../components/email/emailTemplate";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body;

    // the invite will have the invitee's name and some sort of Id if there ,and also some links to interact with
    // the message will show the user has received a message , a payment or some sort of reward
    // If new user , will get an onboarding message along with the info

    // 1. Inviting : senderName , recieverName , pfp , email , inviteLink , shortMessage(type)
    // 2. Reward User by Company : marketing email, send rewards

    const {
      to,
      inviteeName,
      senderName,
      senderEmail,
      senderPfpCode,
      paidAmount,
      templateType,
    } = body;

    let subject =
      "You are invited to Onboardr to embark on your blockchain journey";
    let ReactTemplate;

    if (templateType == "invite") {
      subject = `You are invited to Onboardr by ${senderName} , Embark on the blockchain journey now`;
      ReactTemplate = InviteUserEmailTemplate({
        username: inviteeName,
        invitedByUsername: senderName,
        invitedByEmail: senderEmail,
      });
    } else if (templateType == "payment") {
      subject = `You got paid $${paidAmount} by ${senderName} on Onboardr , Claim Now !!`;
      ReactTemplate = MoneySentTemplate({
        username: inviteeName,
        amount: paidAmount,
        from: senderName,
        senderEmail: senderEmail,
      });
    }

    const data = await resend.emails.send({
      from: "Invite <invite@smood.finance>",
      to: to,
      subject: subject,
      react: ReactTemplate,
      text: "it works!", // plan Version of text message
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
