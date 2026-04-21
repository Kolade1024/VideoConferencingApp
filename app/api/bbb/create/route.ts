import { NextRequest, NextResponse } from "next/server";
import { createRoom } from "@/app/lib/bbb";

export async function POST(request: NextRequest) {
    try {
        const { queryString } = await request.json();

        if (!queryString) {
            return NextResponse.json(
                { error: "queryString is required" },
                { status: 400 }
            );
        }

        const result = await createRoom(queryString);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("BBB create error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create room" },
            { status: 500 }
        );
    }
}
