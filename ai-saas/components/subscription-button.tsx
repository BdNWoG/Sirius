"use client";

import { Zap } from "lucide-react";
import axios from "axios";
import { useState } from "react";

import { Button } from "./ui/button";
import toast from "react-hot-toast";

interface SubscriptionButtonProps {
    isPro: boolean;
};

export const SubscriptionButton = ({ 
    isPro = false
}: SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false); 

    const onClick = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/stripe"); 

            window.location.href = response.data.url; 
        }
        catch (error) {
            toast.error("Something went wrong. Please try again later.");
            //console.log("BILLING_ERROR", error);
        }
        finally {
            setLoading(false);
        } 
    }

    return (
        <Button disabled={loading} variant={isPro ? "default" : "premium"} onClick={onClick}>
            {isPro? "Manage Subscription" : "Upgrade to Pro"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white"/>}
        </Button>
    )
} 