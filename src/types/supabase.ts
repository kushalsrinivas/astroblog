export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          bio: string | null
          social_links: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          bio?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      blogs: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
          tags: string[]
          category: string
          views: number
          published: boolean
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
          tags?: string[]
          category: string
          views?: number
          published?: boolean
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
          tags?: string[]
          category?: string
          views?: number
          published?: boolean
        }
      }
      likes: {
        Row: {
          user_id: string
          blog_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          blog_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          blog_id?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          user_id: string
          blog_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          blog_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          blog_id?: string
          created_at?: string
        }
      }
    }
  }
}
