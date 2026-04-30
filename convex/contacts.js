import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const getAllContacts = query({
  handler: async (ctx) => {
    // Call getCurrentUser (singular)
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    const expensesYouPaid = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_group", (q) =>
        q.eq("paidByUserId", currentUser._id).eq("groupId", undefined)
      )
      .collect();

    const expensesNotPaidByYou = (await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", undefined))
      .collect()
    ).filter(
      (e) =>
        e.paidByUserId !== currentUser._id &&
        e.splits.some((s) => s.userId === currentUser._id)
    );

    const personalExpenses = [...expensesYouPaid, ...expensesNotPaidByYou];

    const contactIds = new Set();
    personalExpenses.forEach((exp) => {
      if (exp.paidByUserId !== currentUser._id)
        contactIds.add(exp.paidByUserId);

      exp.splits.forEach((s) => {
        if (s.userId !== currentUser._id) contactIds.add(s.userId);
      });
    });

    const contactUsers = await Promise.all(
      [...contactIds].map(async (id) => {
        const u = await ctx.db.get(id);
        return u
          ? {
              id: u._id,
              name: u.name,
              email: u.email,
              imageUrl: u.imageUrl,
              type: "user",
            }
          : null;
      })
    );

    const userGroups = (await ctx.db.query("groups").collect())
      .filter((g) => g.members.some((m) => m.userId === currentUser._id))
      .map((g) => ({
        id: g._id,
        name: g.name,
        description: g.description,
        memberCount: g.members.length,
        type: "group",
      }));

    contactUsers.sort((a, b) => a?.name.localeCompare(b?.name));
    userGroups.sort((a, b) => a.name.localeCompare(b.name));

    return {
      users: contactUsers.filter(Boolean),
      groups: userGroups,
    };
  },
});

export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    if (!args.name.trim()) throw new Error("Group name cannot be empty");

    const uniqueMembers = new Set(args.members);
    uniqueMembers.add(currentUser._id);

    for (const id of uniqueMembers) {
      if (!(await ctx.db.get(id))) {
        throw new Error(`User with ID ${id} not found`);
      }
    }

    return await ctx.db.insert("groups", {
      name: args.name.trim(),
      description: args.description?.trim() ?? "",
      createdBy: currentUser._id,
      members: [...uniqueMembers].map((id) => ({
        userId: id,
        role: id === currentUser._id ? "admin" : "member",
        joinedAt: Date.now(),
      })),
    });
  },
});

// Invite a user to a group by email
export const inviteUser = mutation({
  args: {
    email: v.string(),
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);
    const normalizedEmail = args.email.toLowerCase().trim();

    // Verify group exists and user is a member
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const isMember = group.members.some((m) => m.userId === currentUser._id);
    if (!isMember) {
      throw new Error("You are not a member of this group");
    }

    // Check if user exists by email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existingUser) {
      // User exists - add directly to group if not already a member
      const isAlreadyMember = group.members.some(
        (m) => m.userId === existingUser._id
      );
      if (isAlreadyMember) {
        throw new Error("User is already a member of this group");
      }

      await ctx.db.patch(args.groupId, {
        members: [
          ...group.members,
          {
            userId: existingUser._id,
            role: "member",
            joinedAt: Date.now(),
          },
        ],
      });

      return { success: true, added: true, userId: existingUser._id };
    } else {
      // User doesn't exist - create invite
      // Check if there's already a pending invite for this email and group
      const existingInvite = await ctx.db
        .query("groupInvites")
        .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
        .filter((q) =>
          q.and(
            q.eq(q.field("email"), normalizedEmail),
            q.eq(q.field("status"), "pending")
          )
        )
        .first();

      if (existingInvite) {
        throw new Error("Invite already sent to this email");
      }

      await ctx.db.insert("groupInvites", {
        email: normalizedEmail,
        groupId: args.groupId,
        invitedBy: currentUser._id,
        status: "pending",
        createdAt: Date.now(),
      });

      return { success: true, added: false, inviteCreated: true };
    }
  },
});

// Add member to existing group (for when user exists)
export const addMemberToGroup = mutation({
  args: {
    userId: v.id("users"),
    groupId: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    // Verify group exists and current user is a member
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const isMember = group.members.some((m) => m.userId === currentUser._id);
    if (!isMember) {
      throw new Error("You are not a member of this group");
    }

    // Verify user exists
    const userToAdd = await ctx.db.get(args.userId);
    if (!userToAdd) {
      throw new Error("User not found");
    }

    // Check if already a member
    const isAlreadyMember = group.members.some(
      (m) => m.userId === args.userId
    );
    if (isAlreadyMember) {
      throw new Error("User is already a member of this group");
    }

    // Add user to group
    await ctx.db.patch(args.groupId, {
      members: [
        ...group.members,
        {
          userId: args.userId,
          role: "member",
          joinedAt: Date.now(),
        },
      ],
    });

    return { success: true };
  },
});