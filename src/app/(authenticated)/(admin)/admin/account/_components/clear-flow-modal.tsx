import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { Dispatch, SetStateAction } from "react";

export default function ClearWaterFlowModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { mutateAsync: clearWaterTide, isPending } =
    api.waterFlow.clearWaterflowDate.useMutation({
      onSuccess: () => {
        setOpen(false);
        toast({
          title: "Water Tide datas cleared",
        });
      },
    });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clear Water Tide Level Data</DialogTitle>
          <DialogDescription>
            Upon confirmation, all recorded tide level data will be permanently
            erased, and the system will be ready for new data entries.
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => clearWaterTide()}
          className="px-20"
          variant={"destructive"}
          disabled={isPending}
        >
          Clear Water Tide Level Data
        </Button>
      </DialogContent>
    </Dialog>
  );
}
