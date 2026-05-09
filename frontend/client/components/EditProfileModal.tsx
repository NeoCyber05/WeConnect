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
    japanese_level?: string;
    job_title?: string;
    education?: string;
    relationship_status?: string;
    gender?: string;
    date_of_birth?: string;
    phone_number?: string;
  };
}

const RELATIONSHIP_OPTIONS = [
  { value: "Độc thân", label: "Độc thân" },
  { value: "Đang hẹn hò", label: "Đang hẹn hò" },
  { value: "Đã kết hôn", label: "Đã kết hôn" },
  { value: "Khác", label: "Khác" },
];

export default function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const currentRelationship = (formData.relationship_status || "").trim();
  const hasCustomRelationship =
    currentRelationship.length > 0 &&
    !RELATIONSHIP_OPTIONS.some((option) => option.value === currentRelationship);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: (data: typeof initialData) => {
      const payload = {
        full_name: data.full_name.trim(),
        location: data.location?.trim() || undefined,
        bio: data.bio?.trim() || undefined,
        japanese_level: data.japanese_level?.trim() || undefined,
        job_title: data.job_title?.trim() || undefined,
        education: data.education?.trim() || undefined,
        relationship_status: data.relationship_status?.trim() || undefined,
        gender: data.gender?.trim() || undefined,
        date_of_birth: data.date_of_birth || undefined,
        phone_number: data.phone_number?.trim() || undefined,
      };

      return apiFetch("/api/v1/users/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
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
              value={formData.location || ""}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ví dụ: Hà Nội, Việt Nam"
              className="border-wc-border focus:ring-wc-green/20"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-wc-dark font-semibold">Giới tính</Label>
              <select
                id="gender"
                value={formData.gender || ""}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-wc-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-green/20"
              >
                <option value="">Chưa cập nhật</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_birth" className="text-wc-dark font-semibold">Ngày sinh</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="border-wc-border focus:ring-wc-green/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-wc-dark font-semibold">Số điện thoại</Label>
              <Input
                id="phone_number"
                value={formData.phone_number || ""}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Ví dụ: 0987654321"
                className="border-wc-border focus:ring-wc-green/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="japanese_level" className="text-wc-dark font-semibold">Trình độ tiếng Nhật</Label>
              <Input
                id="japanese_level"
                value={formData.japanese_level || ""}
                onChange={(e) => setFormData({ ...formData, japanese_level: e.target.value })}
                placeholder="Ví dụ: N3, N2, JLPT N1"
                className="border-wc-border focus:ring-wc-green/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-wc-dark font-semibold">Công việc</Label>
              <Input
                id="job_title"
                value={formData.job_title || ""}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Ví dụ: UI/UX Designer"
                className="border-wc-border focus:ring-wc-green/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education" className="text-wc-dark font-semibold">Học vấn</Label>
              <Input
                id="education"
                value={formData.education || ""}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Ví dụ: Đại học FPT"
                className="border-wc-border focus:ring-wc-green/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship_status" className="text-wc-dark font-semibold">Tình trạng quan hệ</Label>
            <select
              id="relationship_status"
              value={formData.relationship_status || ""}
              onChange={(e) => setFormData({ ...formData, relationship_status: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-wc-border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wc-green/20"
            >
              <option value="">Chưa cập nhật</option>
              {hasCustomRelationship && (
                <option value={currentRelationship}>{currentRelationship}</option>
              )}
              {RELATIONSHIP_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-wc-dark font-semibold">Giới thiệu bản thân</Label>
            <Textarea
              id="bio"
              value={formData.bio || ""}
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
