import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
});

import { checkAPILimit, increaseAPILimit } from "@/lib/api-limit";

export async function POST(
    req: Request
){
    try{
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("No prompt provided", { status: 400 });
        }

        const freeTrial = await checkAPILimit();

        if (!freeTrial) {
            return new NextResponse("Sorry, you have exceeded the free trial limit. Please upgrade your plan.", { status: 403 });
        }

        const response = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt
                }
            }
        );

        await increaseAPILimit();

        return NextResponse.json(response);
    } 
    catch(error){
        console.log("[MUSIC_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}