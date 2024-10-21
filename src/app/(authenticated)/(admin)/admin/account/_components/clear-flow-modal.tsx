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
  const { mutateAsync: clearWaterflow, isPending } =
    api.waterFlow.clearWaterflowDate.useMutation({
      onSuccess: () => {
        setOpen(false);
        toast({
          title: "Water Flow datas cleared",
        });
      },
    });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clear Water Flow Data</DialogTitle>
          <DialogDescription>
            Once confirmed, all water flow data will be permanently deleted, and
            the system will reset to allow new measurements to be recorded.
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => clearWaterflow()}
          className="px-20"
          variant={"destructive"}
          disabled={isPending}
        >
          Clear Water Flow Data
        </Button>
      </DialogContent>
    </Dialog>
  );
}
