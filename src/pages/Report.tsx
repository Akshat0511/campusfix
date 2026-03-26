import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addComplaint } from "@/lib/store";
import { CATEGORY_LABELS, ComplaintCategory } from "@/lib/types";
import { Camera, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function Report() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const title = (form.get("title") as string).trim();
    const description = (form.get("description") as string).trim();
    const category = form.get("category") as ComplaintCategory;
    const location = (form.get("location") as string).trim();
    const name = (form.get("name") as string).trim();
    const email = (form.get("email") as string).trim();

    if (!title || !description || !category || !location || !name || !email) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const complaint = addComplaint({
      title,
      description,
      category,
      location,
      reporterName: name,
      reporterEmail: email,
      imageUrl: imagePreview || undefined,
    });

    setTimeout(() => {
      setLoading(false);
      toast.success(`Ticket ${complaint.id} created successfully!`);
      navigate("/track");
    }, 600);
  };

  return (
    <div className="container max-w-2xl py-10 md:py-16">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold">Report an Issue</h1>
        <p className="text-muted-foreground mt-1">Fill out the form below. It should take less than 60 seconds.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {/* Reporter info */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Your Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" placeholder="e.g. Rahul Sharma" required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="you@campus.edu" required maxLength={255} />
            </div>
          </div>
        </div>

        {/* Issue details */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Issue Details</h3>
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input id="title" name="title" placeholder="e.g. Broken chair in Room 204" required maxLength={200} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="location" name="location" placeholder="e.g. Hostel Block C, Floor 2" className="pl-9" required maxLength={200} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" placeholder="Describe the issue in detail..." rows={4} required maxLength={1000} />
          </div>
        </div>

        {/* Image upload */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Photo Evidence (Optional)</h3>
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-cover" />
            ) : (
              <>
                <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload or drag & drop</span>
                <span className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 5MB</span>
              </>
            )}
            <input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full gradient-accent text-accent-foreground rounded-xl font-semibold shadow-lg hover:opacity-90 transition-opacity"
        >
          {loading ? "Submitting..." : (
            <>
              <Send className="mr-2 h-5 w-5" /> Submit Report
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
