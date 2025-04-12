import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Get user's prayers
export const getUserPrayers = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    let prayersQuery = ctx.db
      .query("prayers")
      .filter((q) => q.eq(q.field("userId"), user._id));

    if (args.status) {
      prayersQuery = prayersQuery.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await prayersQuery.order("desc").collect();
  },
});

// Create a new prayer request
export const createPrayer = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    isPrivate: v.boolean(),
    verseReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("prayers", {
      userId: user._id,
      title: args.title,
      content: args.content,
      category: args.category,
      isPrivate: args.isPrivate,
      status: "pending",
      createdAt: Date.now(),
      tags: [],
      prayerCount: 0,
      verseReference: args.verseReference,
    });
  },
});

// Get public testimonies
export const getPublicTestimonies = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const testimoniesQuery = ctx.db
      .query("testimonies")
      .filter((q) => q.eq(q.field("isAnonymous"), false))
      .order("desc");
    
    const testimonies = args.limit 
      ? await testimoniesQuery.take(args.limit) 
      : await testimoniesQuery.collect();

    // Fetch associated user data
    const enrichedTestimonies = await Promise.all(
      testimonies.map(async (testimony: Doc<"testimonies">) => {
        const user = await ctx.db.get(testimony.userId);
        return {
          ...testimony,
          user: user ? {
            name: user.name,
            image: user.image,
          } : null,
        };
      })
    );

    return enrichedTestimonies;
  },
});
