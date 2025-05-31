import { prisma } from "../configs/prisma";

export const findToken = async (token: string) => {
    console.log("find token" + token);

    const userToken = await prisma.userToken.findUnique({
        where: { token: token },
        include: { User: true }
    });

    return userToken;
}