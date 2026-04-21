import { NextRequest, NextResponse } from "next/server";
import { enterRoom } from "@/app/lib/bbb";

export async function GET(request: NextRequest) {
    try {
        const sessionToken = request.nextUrl.searchParams.get("sessionToken");

        if (!sessionToken) {
            return NextResponse.json(
                { error: "sessionToken is required" },
                { status: 400 }
            );
        }

        const result = await enterRoom(sessionToken);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("BBB enter error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to enter room" },
            { status: 500 }
        );
    }
}
