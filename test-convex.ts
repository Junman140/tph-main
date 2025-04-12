import { ConvexClient } from "convex/browser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function testFunctions() {
    try {
        console.log("Testing getCurrentUser...");
        const currentUser = await convex.query("users:getCurrentUser");
        console.log("Current User:", currentUser);

        console.log("\nTesting getPosts...");
        const posts = await convex.query("blog:getPosts");
        console.log("Posts:", posts);

        console.log("\nTesting getTags...");
        const tags = await convex.query("blog:getTags");
        console.log("Tags:", tags);

    } catch (error) {
        console.error("Error testing functions:", error);
    }
}

testFunctions(); 