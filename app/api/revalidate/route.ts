import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

// Secret token to prevent unauthorized revalidations
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || "default-token";

export async function POST(request: NextRequest) {
  try {
    const { token, tag, path } = await request.json();

    // Validate the token
    if (token !== REVALIDATE_TOKEN) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Path-based revalidation
    if (path && typeof path === "string") {
      revalidatePath(path);
      return NextResponse.json({
        success: true,
        revalidated: true,
        path,
      });
    }

    // Tag-based revalidation (original logic)
    if (tag && typeof tag === "string") {
      revalidateTag(tag);
      return NextResponse.json({
        success: true,
        revalidated: true,
        tag,
      });
    }

    // If neither path nor tag is provided
    return NextResponse.json(
      { error: "Either tag or path parameter is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revalidate",
      },
      { status: 500 }
    );
  }
}
