import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['users']['Row'];

export default function Profile({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    github: '',
    website: '',
  });

  useEffect(() => {
    getProfile();
  }, [userId]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setSocialLinks(data.social_links || { twitter: '', github: '', website: '' });
      }
    } catch (error) {
      console.error(error);
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({
          name,
          bio,
          avatar_url: avatarUrl,
          social_links: socialLinks,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating profile!');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <form onSubmit={(e) => {
        e.preventDefault();
        updateProfile();
      }} className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Avatar URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Social Links</label>
          <input
            type="url"
            placeholder="Twitter URL"
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
          />
          <input
            type="url"
            placeholder="GitHub URL"
            value={socialLinks.github}
            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
          />
          <input
            type="url"
            placeholder="Website URL"
            value={socialLinks.website}
            onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
