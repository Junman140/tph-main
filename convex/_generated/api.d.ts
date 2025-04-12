/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as client from "../client.js";
import type * as convex from "../convex.js";
import type * as events from "../events.js";
import type * as http from "../http.js";
import type * as index from "../index.js";
import type * as node_index from "../node/index.js";
import type * as node_utils from "../node/utils.js";
import type * as posts from "../posts.js";
import type * as prayers from "../prayers.js";
import type * as subscribers from "../subscribers.js";
import type * as subscriptions from "../subscriptions.js";
import type * as test from "../test.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  client: typeof client;
  convex: typeof convex;
  events: typeof events;
  http: typeof http;
  index: typeof index;
  "node/index": typeof node_index;
  "node/utils": typeof node_utils;
  posts: typeof posts;
  prayers: typeof prayers;
  subscribers: typeof subscribers;
  subscriptions: typeof subscriptions;
  test: typeof test;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
