"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { UserInviteSelect } from "@/components/user-invite-select";

const AddMemberModal = ({ isOpen, onClose, groupId, onSuccess }) => {
  const [isInviting, setIsInviting] = useState(false);

  const inviteUser = useConvexMutation(api.contacts.inviteUser);
  const addMemberToGroup = useConvexMutation(api.contacts.addMemberToGroup);

  const handleSelect = async (user) => {
    if (!groupId) return;

    setIsInviting(true);
    try {
      if (user.isInvited) {
        // Handle invite
        const result = await inviteUser.mutate({ email: user.email, groupId });
        if (result.added) {
          toast.success("User added to group!");
        } else {
          toast.success(`Invite sent to ${user.email}`);
        }
      } else {
        // Handle existing user
        await addMemberToGroup.mutate({ userId: user.id, groupId });
        toast.success("User added to group!");
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to add member: " + error.message);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <UserInviteSelect
            onSelect={handleSelect}
            excludeIds={[]}
            groupId={groupId}
            trigger={
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={isInviting}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Search by name or email...
              </Button>
            }
            placeholder="Search by name or email..."
            disabled={isInviting}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;

