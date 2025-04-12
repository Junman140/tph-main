import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    createdAt: v.string(),
    userId: v.string(),
    image: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    phoneNumber: v.string(),
    lastLoginAt: v.string(),
    lastActiveAt: v.string(),
    role: v.string(),
    isEmailVerified: v.boolean(),
    metadata: v.any(),
    preferences: v.object({
      theme: v.string(),
      notifications: v.boolean(),
      language: v.string()
    })
  }).index("by_token", ["tokenIdentifier"]),

  prayers: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    isPrivate: v.boolean(),
    status: v.string(), // "pending", "answered"
    createdAt: v.number(),
    answeredAt: v.optional(v.number()),
    tags: v.array(v.string()),
    prayerCount: v.number(), // Number of people who prayed for this request
    supportingVerses: v.optional(v.array(v.string())),
    verseReference: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"]),

  testimonies: defineTable({
    userId: v.id("users"),
    prayerId: v.id("prayers"),
    title: v.string(),
    content: v.string(),
    prayerDuration: v.number(), // Time between prayer request and answer (in days)
    createdAt: v.number(),
    tags: v.array(v.string()),
    likes: v.number(),
    isAnonymous: v.boolean(),
    verseReference: v.optional(v.string()),
    mediaUrls: v.optional(v.array(v.string())), // Optional images or videos
  })
    .index("by_user", ["userId"])
    .index("by_prayer", ["prayerId"]),

  prayerSupport: defineTable({
    userId: v.id("users"),
    prayerId: v.id("prayers"),
    createdAt: v.number(),
    commitment: v.string(), // "daily", "weekly", "once"
    note: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_prayer", ["prayerId"]),

  posts: defineTable({
    title: v.string(),
    content: v.string(),
    published: v.boolean(),
    authorId: v.string(),
    slug: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_author", ["authorId"])
    .index("by_published", ["published"]),

  subscribers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    subscriptionDate: v.number(),
    subscribedAt: v.string(),
    status: v.string(),
  }).index("by_email", ["email"]),

  subscriptions: defineTable({
    userId: v.string(),
    planId: v.string(),
    status: v.string(),
    currentPeriodStart: v.string(),
    currentPeriodEnd: v.string(),
    cancelAtPeriodEnd: v.boolean(),
  }).index("by_userId", ["userId"]),

  events: defineTable({
    eventId: v.string(),
    userId: v.string(),
    status: v.string(),
    attendeeCount: v.number(),
    eventTitle: v.string(),
    notes: v.optional(v.string()),
    registeredAt: v.string(),
  })
    .index("by_eventId", ["eventId"])
    .index("by_userId", ["userId"]),
});