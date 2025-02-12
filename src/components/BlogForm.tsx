import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Editor from './Editor';
import slugify from 'slugify';

interface BlogFormProps {
  blogId?: string;
  onSuccess?: () => void;
}

export default function BlogForm({ blogId, onSuccess }: BlogFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(true);

  useEffect(() => {
    if (blogId) {
      loadBlog();
    }
  }, [blogId]);

  async function loadBlog() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setTags(data.tags.join(', '));
        setIsDraft(!data.published);
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      alert('Error loading blog!');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent, publish: boolean) {
    e.preventDefault();
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) throw new Error('No user logged in');

      const slug = slugify(title, { lower: true, strict: true });
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const blogData = {
        title,
        slug,
        content,
        category,
        tags: tagArray,
        published: publish,
        author_id: user.id,
      };

      let error;

      if (blogId) {
        ({ error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blogId));
      } else {
        ({ error } = await supabase
          .from('blogs')
          .insert([blogData]));
      }

      if (error) throw error;

      alert(publish ? 'Blog published successfully!' : 'Draft saved successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="blog-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="form-group">
        <Editor content={content} onChange={setContent} />
      </div>

      <div className="button-group">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  );
}
