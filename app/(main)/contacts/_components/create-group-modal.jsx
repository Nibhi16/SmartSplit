import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import z, { optional } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

const groupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
});

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [commandOpen, setcommandOpen] = useState(false);

    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
    const { data: searchResults, isLoading: isSearching } = useConvexQuery(api.users.searchUsers, { query: searchQuery });

    const { register,
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

    const handleClose = () => {
        reset();
        onClose();
    };
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Group Name</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                    <div className='space-y-2'>
                        <Label htmlFor="name">Group Name</Label>
                        <Input id="name" placeholder="Enter group name"
                            {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor="description">Description {optional}</Label>
                        <Textarea id="description" placeholder="Enter group description"
                            {...register("description")} />
                    </div>
                    <div className='space-y-2'>
                        <Label>Members</Label>
                        <div className='flex flex-wrap gap-2 mb-2'>
                            {currentUser && (
                                <Badge varient="secondary" className="px-3 py-1">
                                    <Avatar className="h-5 w-5 mr-2">
                                        <AvatarImage src={currentUser.imageUrl} />
                                        <AvatarFallback>{currentUser.name?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate text-sm">{currentUser.name} (You)</span>
                                </Badge>
                            )}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        varient="outline"
                                        size="sm"
                                        className="h-8 gap-1 text-xs">
                                        <UserPlus className='h-3.5 w-3.5'></UserPlus>
                                        Add member
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Command>
                                        <CommandInput placeholder="Type a command or search..." />
                                        <CommandList>
                                            <CommandEmpty>No results found.</CommandEmpty>

                                            <CommandGroup heading="Suggestions">
                                                <CommandItem>Calendar</CommandItem>
                                                <CommandItem>Search Emoji</CommandItem>
                                                <CommandItem>Calculator</CommandItem>
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </form>
                <DialogFooter>Footer</DialogFooter>
            </DialogContent>
        </Dialog>
    )
};
export default CreateGroupModal;