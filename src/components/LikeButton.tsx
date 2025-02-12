import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LikeButtonProps {
  blogId: string;
  userId?: string;
  initialLikes?: number;
}

export default function LikeButton({ blogId, userId, initialLikes = 0 }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      checkLikeStatus();
    } else {
      setLoading(false);
    }
  }, [userId, blogId]);

  async function checkLikeStatus() {
    try {
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('blog_id', blogId)
        .eq('user_id', userId)
        .single();

      setIsLiked(!!data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking like status:', error);
      setLoading(false);
    }
  }

  async function toggleLike() {
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('blog_id', blogId)
          .eq('user_id', userId);
        setLikeCount(prev => prev - 1);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert([{ blog_id: blogId, user_id: userId }]);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={toggleLike}
      disabled={loading}
      className={`like-button ${isLiked ? 'liked' : ''}`}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill={isLiked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="like-count">{likeCount}</span>
    </button>
  );
}

<style>
  .like-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    border: var(--border-brutal);
    background: var(--color-background);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .like-button:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-brutal);
  }

  .like-button.liked {
    background: var(--color-accent);
    color: white;
  }

  .like-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .like-count {
    font-weight: bold;
    min-width: 20px;
    text-align: center;
  }
</style>
