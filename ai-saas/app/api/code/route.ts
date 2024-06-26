import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

const { ChatCompletionRequestMessage } = require("openai");

import { checkAPILimit, increaseAPILimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const instructionMessage: typeof ChatCompletionRequestMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}

export async function POST(
    req: Request
){
    try{
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!messages) {
            return new NextResponse("No messages provided", { status: 400 });
        }

        const freeTrial = await checkAPILimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Sorry, you have exceeded the free trial limit. Please upgrade your plan.", { status: 403 });
        }

        const response = await openai.chat.completions.create({   
            model: "gpt-3.5-turbo",
            messages: [instructionMessage,...messages]
        });

        if (!isPro){
            await increaseAPILimit();
        }

        return NextResponse.json(response.choices[0].message);
    } 
    catch(error){
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}