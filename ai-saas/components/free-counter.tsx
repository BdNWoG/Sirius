"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { Card, CardContent } from "./ui/card";
import { MAX_FREE_COUNTS } from "@/constants";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useProModal } from "@/hooks/use-pro-modal";

interface FreeCounterProps {
    APILimitCount: number
}

export const FreeCounter = ({
    APILimitCount = 0
}: FreeCounterProps) => {
    const proModal = useProModal();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="px-3">
            <Card className="bg-black/10 border-0">
                <CardContent className="py-6">
                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p>
                            {APILimitCount} / {MAX_FREE_COUNTS} Free Generations
                        </p>
                        <Progress className="h-3" value={(APILimitCount/MAX_FREE_COUNTS) * 100}/>
                    </div>
                    <Button onClick={proModal.onOpen} className="w-full" variant={"premium"}>
                        Upgrade
                        <Zap className="w-4 h-4 ml-2 fill-white"/>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}