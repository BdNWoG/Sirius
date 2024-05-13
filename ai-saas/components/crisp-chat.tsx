"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("5e7494d8-dbce-4975-9685-6af0c22610b4");
    }, []);
    return null;
}