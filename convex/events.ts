"use node";

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const registerForEvent = mutation({
  args: {
    eventId: v.string(),
    userId: v.string(),
    status: v.string(),
    attendeeCount: v.number(),
    eventTitle: v.string(),
    notes: v.optional(v.string()),
    registeredAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      eventId: args.eventId,
      userId: args.userId,
      status: args.status,
      attendeeCount: args.attendeeCount,
      eventTitle: args.eventTitle,
      notes: args.notes,
      registeredAt: args.registeredAt,
    });
  },
});

export const getEvent = query({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_eventId", (q) => q.eq("eventId", args.eventId))
      .first();
  },
});

export const getEventsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
}); 