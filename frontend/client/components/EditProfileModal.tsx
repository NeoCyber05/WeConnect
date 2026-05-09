import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    full_name: string;
    location?: string;
    bio?: string;
  };
}

export default function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: typeof initialData) =>
      apiFetch("/api/v1/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast({ title: "Thành công", description: "Hồ sơ của bạn đã được cập nhật." });
      onClose();
    },
    onError: (error: Error) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-wc-dark font-bold text-xl">Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-wc-dark font-semibold">Họ và tên</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="border-wc-border focus:ring-wc-green/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-wc-dark font-semibold">Vị trí</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ví dụ: Hà Nội, Việt Nam"
              className="border-wc-border focus:ring-wc-green/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-wc-dark font-semibold">Giới thiệu bản thân</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Chia sẻ một chút về bản thân bạn..."
              className="min-h-[120px] border-wc-border focus:ring-wc-green/20 resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-wc-border text-wc-gray"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-wc-green hover:bg-wc-green/90 text-white font-bold px-8"
            >
              {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
