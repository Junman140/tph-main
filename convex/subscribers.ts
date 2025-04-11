import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      if (existing.status === "unsubscribed") {
        // Reactivate subscription
        await ctx.db.patch(existing._id, { status: "active" });
        return { status: "resubscribed" };
      }
      return { status: "already_subscribed" };
    }

    // Add new subscriber
    await ctx.db.insert("subscribers", {
      email: args.email,
      subscriptionDate: Date.now(),
      status: "active",
    });

    return { status: "subscribed" };
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!subscriber) {
      return { status: "not_found" };
    }

    await ctx.db.patch(subscriber._id, { status: "unsubscribed" });
    return { status: "unsubscribed" };
  },
});

export const getSubscribers = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("subscribers")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
}); 