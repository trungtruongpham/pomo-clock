import { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Only run middleware on the /profile path
    "/profile",
    "/profile/:path*",
  ],
};
