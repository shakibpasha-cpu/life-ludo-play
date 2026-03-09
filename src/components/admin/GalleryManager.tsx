import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Image, Upload } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  media_type: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
}

const CATEGORIES = ["Family Events", "Corporate Events", "School Events", "Festivals", "Weddings", "General"];

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) { toast.error("Failed to load gallery"); return; }
    setItems((data as GalleryItem[]) || []);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !title.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("gallery_items").insert({
      title: title.trim(),
      category,
      image_url: urlData.publicUrl,
      media_type: file.type.startsWith("video") ? "video" : "image",
      sort_order: items.length,
    });

    if (insertError) {
      toast.error("Failed to save item");
      setUploading(false);
      return;
    }

    setTitle("");
    setCategory("General");
    setShowForm(false);
    setUploading(false);
    fetchItems();
    toast.success("Image added to gallery");
  };

  const toggleVisibility = async (item: GalleryItem) => {
    const { error } = await supabase
      .from("gallery_items")
      .update({ visible: !item.visible })
      .eq("id", item.id);
    if (error) { toast.error("Failed to update"); return; }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, visible: !i.visible } : i));
  };

  const deleteItem = async (item: GalleryItem) => {
    // Extract filename from URL
    const parts = item.image_url.split("/");
    const fileName = parts[parts.length - 1];

    await supabase.storage.from("gallery").remove([fileName]);
    const { error } = await supabase.from("gallery_items").delete().eq("id", item.id);
    if (error) { toast.error("Failed to delete"); return; }
    setItems(prev => prev.filter(i => i.id !== item.id));
    toast.success("Item deleted");
  };

  if (loading) return <p className="text-muted-foreground text-center py-10">Loading gallery...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-lg">Gallery Management</h3>
        <Button variant="hero" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Image
        </Button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Family Fun Day"
                className="bg-card"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Upload Image *</label>
            <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border bg-card cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : "Click to select image"}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleUpload}
                disabled={uploading || !title.trim()}
                className="hidden"
              />
            </label>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No gallery items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className={`glass-card rounded-xl overflow-hidden ${!item.visible ? "opacity-50" : ""}`}>
              <div className="aspect-video relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-display font-bold text-sm truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => toggleVisibility(item)}
                    className="p-1.5 rounded hover:bg-secondary transition-colors"
                    title={item.visible ? "Hide" : "Show"}
                  >
                    {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="p-1.5 rounded hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
