import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subscriptionDate = Date.now();
    const subscribedAt = new Date().toISOString();

    await ctx.db.insert("subscribers", {
      email: args.email,
      name: args.name,
      subscriptionDate,
      subscribedAt,
      status: "active",
    });

    return { success: true };
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