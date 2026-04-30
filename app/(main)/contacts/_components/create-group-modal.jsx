import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { UserPlus, X, Mail } from "lucide-react";
import { toast } from "sonner";
import { UserInviteSelect } from "@/components/user-invite-select";

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
});

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedInvites, setSelectedInvites] = useState([]); // Track email invites

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  const createGroup = useConvexMutation(api.contacts.createGroup);
  const inviteUser = useConvexMutation(api.contacts.inviteUser);

  const addMember = (user) => {
    if (user.isInvited) {
      // Handle invite
      if (!selectedInvites.includes(user.email)) {
        setSelectedInvites([...selectedInvites, user.email]);
      }
    } else {
      // Handle existing user
      if (!selectedMembers.some((m) => m.id === user.id)) {
        setSelectedMembers([...selectedMembers, user]);
      }
    }
  };

  const removeInvite = (email) => {
    setSelectedInvites(selectedInvites.filter((e) => e !== email));
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
  };

  const handleClose = () => {
    reset();
    setSelectedMembers([]);
    setSelectedInvites([]);
    onClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const memberIds = (selectedMembers ?? []).map((member) => member.id);
      const groupId = await createGroup.mutate({
        name: data.name,
        description: data.description,
        members: memberIds,
      });

      // Send invites for emails that don't have users
      for (const email of selectedInvites) {
        try {
          await inviteUser.mutate({ email, groupId });
        } catch (error) {
          console.error(`Failed to invite ${email}:`, error);
          // Continue with other invites even if one fails
        }
      }

      console.log("Group created with ID:", groupId);
      toast.success("Group created successfully!");
      if (selectedInvites.length > 0) {
        toast.success(`Invited ${selectedInvites.length} user(s) via email`);
      }
      handleClose();
      if (onSuccess) onSuccess(groupId);
    } catch (error) {
      toast.error("Failed to create group: " + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input id="name" placeholder="Enter group name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter group description"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Members</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {currentUser && (
                <Badge variant="secondary" className="px-3 py-1">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={currentUser.imageUrl} />
                    <AvatarFallback>
                      {currentUser.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm">
                    {currentUser.name} (You)
                  </span>
                </Badge>
              )}

              {(selectedMembers ?? []).map((member) => (
                <Badge key={member.id} variant="secondary" className="px-3 py-1">
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback>
                      {member.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.name}</span>
                  <Button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {(selectedInvites ?? []).map((email) => (
                <Badge key={email} variant="outline" className="px-3 py-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{email} (Invited)</span>
                  <Button
                    type="button"
                    onClick={() => removeInvite(email)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              <UserInviteSelect
                onSelect={(user) => {
                  if (user.isInvited) {
                    addInvite(user.email);
                  } else {
                    addMember(user);
                  }
                }}
                excludeIds={[...(selectedMembers ?? []).map(m => m.id), currentUser?._id].filter(Boolean)}
                groupId={null}
                trigger={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add member
                  </Button>
                }
                placeholder="Search by name or email..."
              />
            </div>

            {selectedMembers.length === 0 && selectedInvites.length === 0 && (
              <p className="text-sm text-amber-600">
                Add at least one other person to the group
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (selectedMembers.length === 0 && selectedInvites.length === 0)}
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
