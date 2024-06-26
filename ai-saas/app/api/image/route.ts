import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

import { checkAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(
    req: Request
){
    try{
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = "1", resolution = "512x512" } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("No prompt provided", { status: 400 });
        }

        if (!amount) {
            return new NextResponse("No amount provided", { status: 400 });
        }

        if (!resolution) {
            return new NextResponse("No resolution  provided", { status: 400 });
        }

        const freeTrial = await checkAPILimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Sorry, you have exceeded the free trial limit. Please upgrade your plan.", { status: 403 });
        }

        const response = await openai.images.generate({   
            prompt, n: parseInt(amount, 10), size: resolution
        });

        if (!isPro){
            await increaseAPILimit();
        }

        return NextResponse.json(response.data);
    } 
    catch(error){
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}