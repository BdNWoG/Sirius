import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
});

import { checkAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

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
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Sorry, you have exceeded the free trial limit. Please upgrade your plan.", { status: 403 });
        }

        const response = await replicate.run(
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", 
            { 
                input: {
                    prompt: prompt
                }
            }
        );
        
        if (!isPro){
            await increaseAPILimit();
        }

        return NextResponse.json(response);
    } 
    catch(error){
        console.log("[VIDEO_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}