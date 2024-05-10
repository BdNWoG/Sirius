import { auth } from "@clerk/nextjs/server";

import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseAPILimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return;
    }

    const userAPILimit = await prismadb.userAPILimit.findUnique({
        where: {
            userId: userId,
        }
    });

    if (userAPILimit) {
        await prismadb.userAPILimit.update({
            where: {
                userId: userId
            },
            data: {
                count: userAPILimit.count + 1
            }
        });
    }
    else {
        await prismadb.userAPILimit.create({
            data: {
                userId: userId,
                count: 1
            }
        });
    }
};

export const checkAPILimit = async () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    const userAPILimit = await prismadb.userAPILimit.findUnique({
        where: {
            userId: userId,
        }
    });

    if (!userAPILimit || userAPILimit.count < MAX_FREE_COUNTS) {
        return true;
    }
    else {
        return false;
    }
};