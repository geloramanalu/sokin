import { PrismaClient, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type SignupRequestBody = Omit<Prisma.OwnerCreateInput, "id"> & {
  name?: string;
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body as SignupRequestBody;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password },
    });

    return res.status(201).json(newUser);
  }

  if (req.method === "GET") {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
