"use client"

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("q") || "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (value) {
                router.push(`/search?q=${value}`);
            } else {
                router.push(`/search`);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [value, router]);

    return (
        <Input
            placeholder="Search products..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="max-w-md"
        />
    );
}
