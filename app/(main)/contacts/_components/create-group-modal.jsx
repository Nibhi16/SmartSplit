import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { zodResolver} from "@hookform/resolvers/zod";
const CreateGroupModal = ({isOpen, onClose, onSuccess}) => {
    const {register,
        handleSubmit,
        formState:{errors, isSubmitting},
        reset,
    }=useForm({
        resolver:zodRes
    });

    const handleClose=()=>{
        reset();
        onClose();
    };
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                </DialogHeader>
                <form></form>
                <DialogFooter>Footer</DialogFooter>
            </DialogContent>
        </Dialog>
    )
};
export default CreateGroupModal;