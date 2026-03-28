import { useState } from "react";
import { Image, X, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import { CATEGORIES } from "./CategoryBrowser";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();
  const { createPost } = usePosts();

  if (!user || !userProfile) return null;

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      let imageURL: string | undefined;
      if (image) {
        const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageURL = await getDownloadURL(storageRef);
      }
      await createPost(content.trim(), category, imageURL);
      setContent("");
      setCategory("General");
      removeImage();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <img
          src={userProfile.avatar}
          alt={userProfile.name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the community..."
            className="min-h-[80px] resize-none text-sm border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl"
          />

          {imagePreview && (
            <div className="relative inline-block">
              <img src={imagePreview} alt="preview" className="w-32 h-24 object-cover rounded-lg" />
              <button type="button" onClick={removeImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Image className="w-5 h-5" />
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
              disabled={loading || !content.trim()}
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
