import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Store the current user in the "users" table if not already there
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this user by tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // If the name changed, update it
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // If it's a new identity, insert it into the "users" table
    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      imageUrl: identity.pictureUrl,
    });

    // Check for pending group invites for this email
    const pendingInvites = await ctx.db
      .query("groupInvites")
      .withIndex("by_email_and_status", (q) =>
        q.eq("email", identity.email.toLowerCase()).eq("status", "pending")
      )
      .collect();

    // Auto-join groups from pending invites
    for (const invite of pendingInvites) {
      const group = await ctx.db.get(invite.groupId);
      if (group) {
        // Check if user is already a member
        const isMember = group.members.some((m) => m.userId === userId);
        if (!isMember) {
          // Add user to group
          await ctx.db.patch(invite.groupId, {
            members: [
              ...group.members,
              {
                userId,
                role: "member",
                joinedAt: Date.now(),
              },
            ],
          });
        }
        // Mark invite as accepted
        await ctx.db.patch(invite._id, { status: "accepted" });
      }
    }

    return userId;
  },
});

// Fetch the currently authenticated user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const searchUsers = query({
  args:{query:v.string() },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    
    // Trim the query
    const trimmedQuery = args.query.trim();
    
    if (trimmedQuery.length < 2){
      return { users: [], canInvite: false, email: null };
    }
    
    const nameResults = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", trimmedQuery))
      .collect();

    const emailResults = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) => q.search("email", trimmedQuery))
      .collect();

    const users = [
      ...nameResults,
      ...emailResults.filter(
        (email) => !nameResults.some((name) =>name._id === email._id)
      ),
    ];

    const filteredUsers = users
      .filter((user) => user._id !== currentUser._id)
      .map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      }));

    // Email validation
    const email = trimmedQuery.toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const canInvite = filteredUsers.length === 0 && isValidEmail;

    return {
      users: filteredUsers,
      canInvite,
      email: canInvite ? email : null,
    };
  },
});