import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { zodResolver} from "@hookform/resolvers/zod";
import z, { optional } from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const groupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
});

const CreateGroupModal = ({isOpen, onClose, onSuccess}) => {
    const {register,
        handleSubmit,
        formState:{errors, isSubmitting},
        reset,
    }=useForm({
        resolver:zodResolver(groupSchema),
        defaultValues:{
        name:"",
        description:"",
    },
    });

    const handleClose=()=>{
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
                        {...register("name")}/>
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>
                     <div className='space-y-2'>
                        <Label htmlFor="description">Description {optional}</Label>
                        <Textarea id="description" placeholder="Enter group description"
                        {...register("description")}/>
                    </div>
                    <div className='space-y-2'>
                        <Label>Members</Label>
                        <div>
                            
                        </div>

                    </div>
                </form>
                <DialogFooter>Footer</DialogFooter>
            </DialogContent>
        </Dialog>
    )
};
export default CreateGroupModal;