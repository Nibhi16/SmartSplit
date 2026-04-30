"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserInviteSelect } from "@/components/user-invite-select";

export function ParticipantSelector({ participants, onParticipantsChange, groupId = null }) {
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  // Add a participant (user or invited)
  const addParticipant = (user) => {
    // Check if already added
    if ((participants ?? []).some((p) => p.id === user.id)) {
      return;
    }

    // Add to list
    onParticipantsChange([...(participants ?? []), user]);
  };

  // Remove a participant
  const removeParticipant = (userId) => {
    // Don't allow removing yourself
    if (userId === currentUser?._id) {
      return;
    }

    onParticipantsChange((participants ?? []).filter((p) => p.id !== userId));
  };

  // Get excluded IDs (already selected participants)
  const excludeIds = (participants ?? []).map((p) => p.id);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(participants ?? []).map((participant) => (
          <Badge
            key={participant.id}
            variant={participant.isInvited ? "outline" : "secondary"}
            className="flex items-center gap-2 px-3 py-2"
          >
            {participant.isInvited ? (
              <Mail className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Avatar className="h-5 w-5">
                <AvatarImage src={participant.imageUrl} />
                <AvatarFallback>
                  {participant.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            )}
            <span>
              {participant.id === currentUser?._id
                ? "You"
                : participant.isInvited
                ? `${participant.email} (Invited)`
                : participant.name || participant.email}
            </span>
            {participant.id !== currentUser?._id && (
              <button
                type="button"
                onClick={() => removeParticipant(participant.id)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}

        {(participants ?? []).length < 2 && (
          <UserInviteSelect
            onSelect={addParticipant}
            excludeIds={excludeIds}
            groupId={groupId}
            placeholder="Search by name or email..."
          />
        )}
      </div>
    </div>
  );
}
