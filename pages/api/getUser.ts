// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "../../utils/Stych";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { phone, email } = req.body;
  //   console.log(email, phone);
  const response = await getUser(phone, email);
  debugger;
  //   console.log(response);
  res.status(200).json({ user: response });
}
