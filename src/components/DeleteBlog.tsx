import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DeleteBlogProps {
  blogId: string;
  onSuccess?: () => void;
}

export default function DeleteBlog({ blogId, onSuccess }: DeleteBlogProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);

      if (error) throw error;

      alert('Blog deleted successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="delete-button"
    >
      {loading ? 'Deleting...' : 'Delete Blog'}
    </button>
  );
}
