'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Star } from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function AddressCard({ address, onEdit, onDelete, onToggleDefault }) {

  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-4">
          {/* Main Address Details */}
          <div>
            <p className="font-semibold">{address.fullName}</p>
            <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
            <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.postalCode}</p>
            <p className="text-sm text-muted-foreground mt-1">Phone: {address.phoneNumber}</p>
          </div>

          {/* Action Buttons on the Right */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button aria-label="Edit" variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(address)}><Edit className="h-4 w-4" /></Button>
            <AlertDialogTrigger asChild>
              <Button aria-label="Delete Address" variant="destructive" size="icon" className="h-8 w-8" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
          </div>
        </div>
      </CardContent>

        {/* Action Buttons on the Right */}
        <div className="border-t p-2">
        <Button 
          variant={address.isDefault ? "default" : "outline"} // Black if default, white if not
          size="sm"
          className="w-full"
          onClick={() => onToggleDefault(address._id)}
        >
          <Star className={cn("h-4 w-4 mr-2", address.isDefault && "fill-current")} />
          {address.isDefault ? 'Default Address' : 'Set as Default'}
        </Button>
      </div>
    </Card>
  );
}