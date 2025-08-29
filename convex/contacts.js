import { query } from "./_generated/server";
import { internal } from "./_generated/api";

export const getAllContacts = query({
    haldler:async (ctx)=>{
        const currentUser = await ctx.runQuery(internal.users.getCurrentUsers);
    },
});