import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { defineSchema, defineTable } from "convex/server";

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      slug: args.slug,
      authorId: identity.subject,
      published: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      imageUrl: args.imageUrl,
    });

    return postId;
  },
});

export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    published: v.optional(v.boolean()),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    // If slug is being updated, check for uniqueness
    if (rest.slug) {
      const sanitizedSlug = rest.slug.trim().toLowerCase().replace(/\s+/g, "-");
      const existing = await ctx.db
        .query("posts")
        .withIndex("by_slug")
        .eq("slug", sanitizedSlug)
        .filter((q) => q.neq("_id", id))
        .first();

      if (existing) {
        throw new Error("Slug already exists. Choose a unique one.");
      }
      rest.slug = sanitizedSlug;
    }

    // Sanitize other string inputs if provided
    if (rest.title) rest.title = rest.title.trim();
    if (rest.content) rest.content = rest.content.trim();

    await ctx.db.patch(id, rest);
    return await ctx.db.get(id);
  },
});

export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.postId);
  },
});

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug")
      .eq("slug", args.slug)
      .first();
  },
});

export const getPublishedPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();
  },
});

export const getPostsByAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});