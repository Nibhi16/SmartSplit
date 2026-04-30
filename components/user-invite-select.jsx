"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, UserPlus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

/**
 * Reusable component for selecting users with invite support
 * 
 * @param {Object} props
 * @param {Function} props.onSelect - Called when a user is selected or invited
 * @param {Array} props.excludeIds - User IDs to exclude from results
 * @param {string} props.groupId - Optional group ID for invites
 * @param {ReactNode} props.trigger - Custom trigger button (optional)
 * @param {string} props.placeholder - Placeholder text for search
 * @param {boolean} props.disabled - Whether the selector is disabled
 */
export function UserInviteSelect({
  onSelect,
  excludeIds = [],
  groupId = null,
  trigger,
  placeholder = "Search by name or email...",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  // Keep this query always active so search updates as the user types.
  const searchResults = useQuery(
    api.users.searchUsers,
    { query: searchQuery || "" }
  );
  const isLoading = searchResults === undefined;

  const inviteUser = useConvexMutation(api.contacts.inviteUser);

  // Filter out excluded users
  const filteredUsers = searchResults?.users?.filter(
    (user) => !excludeIds.includes(user.id)
  ) || [];

  const handleSelectUser = (user) => {
    onSelect({
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      isInvited: false,
    });
    setOpen(false);
    setSearchQuery("");
  };

  const handleInvite = async (email) => {
    if (!email || isInviting) return;

    setIsInviting(true);
    try {
      if (groupId) {
        const result = await inviteUser.mutate({ email, groupId });
        if (result.added && result.userId) {
          toast.success("User added!");
          onSelect({
            id: result.userId,
            name: email.split("@")[0], // Temporary name until we fetch user
            email: email,
            imageUrl: null,
            isInvited: false,
          });
        } else {
          toast.success(`Invite sent to ${email}`);
          onSelect({
            id: `invite-${email}`, // Temporary ID for pending invites
            name: email.split("@")[0],
            email: email,
            imageUrl: null,
            isInvited: true,
          });
        }
      } else {
        onSelect({
          id: `invite-${email}`,
          name: email.split("@")[0],
          email: email,
          imageUrl: null,
          isInvited: true,
        });
      }
      setOpen(false);
      setSearchQuery("");
    } catch (error) {
      toast.error("Failed to invite user: " + error.message);
    } finally {
      setIsInviting(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="h-8 gap-1 text-xs"
      type="button"
      disabled={disabled}
    >
      <UserPlus className="h-3.5 w-3.5" />
      Add person
    </Button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {/* Only show empty state if no users AND can't invite */}
            {filteredUsers.length === 0 && !searchResults?.canInvite && (
              <CommandEmpty>
                {searchQuery.length < 2 ? (
                  <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                    Type at least 2 characters to search
                  </p>
                ) : isLoading ? (
                  <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                    Searching...
                  </p>
                ) : (
                  <p className="py-3 px-4 text-sm text-center text-muted-foreground">
                    No users found
                  </p>
                )}
              </CommandEmpty>
            )}

            {filteredUsers.length > 0 && (
              <CommandGroup heading="Users">
                {(filteredUsers ?? []).map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name + user.email}
                    onSelect={() => handleSelectUser(user)}
                    disabled={isInviting}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchResults?.canInvite && searchResults?.email && (
              <CommandGroup heading="Invite">
                <CommandItem
                  value={`invite-${searchResults.email}`}
                  onSelect={() => handleInvite(searchResults.email)}
                  disabled={isInviting}
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Invite {searchResults.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {groupId ? "Send an email invite" : "Add as pending invite"}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

