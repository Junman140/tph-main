import { ConvexClient } from "convex/browser";
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/clerk-react";

export function useConvex() {
  const { getToken } = useClerkAuth();
  const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  client.setAuth(async () => {
    const token = await getToken({ template: "convex" });
    return token || null;
  });

  return client;
}