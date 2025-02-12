import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "../styles/BookmarkButton.css";

interface BookmarkButtonProps {
  blogId: string;
  userId?: string;
}

export default function BookmarkButton({
  blogId,
  userId,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      checkBookmarkStatus();
    } else {
      setLoading(false);
    }
  }, [userId]);

  async function checkBookmarkStatus() {
    try {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("blog_id", blogId)
        .eq("user_id", userId)
        .single();

      setIsBookmarked(!!data);
      setLoading(false);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      setLoading(false);
    }
  }

  async function toggleBookmark() {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await supabase
          .from("bookmarks")
          .delete()
          .eq("blog_id", blogId)
          .eq("user_id", userId);
      } else {
        // Add bookmark
        await supabase
          .from("bookmarks")
          .insert([{ blog_id: blogId, user_id: userId }]);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleBookmark}
      disabled={loading}
      className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        title={isBookmarked ? "Bookmarked" : "Not bookmarked"}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
