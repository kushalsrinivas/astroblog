import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdSpaceProps {
  placement: 'sidebar' | 'feed' | 'content';
  className?: string;
}

export default function AdSpace({ placement, className = '' }: AdSpaceProps) {
  const [showAd, setShowAd] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
    initializeAds();
  }, []);

  async function checkSubscriptionStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      setUserId(session.user.id);
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      setShowAd(!subscription);
    }
  }

  function initializeAds() {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Error initializing ads:', error);
    }
  }

  if (!showAd) return null;

  return (
    <div className={`ad-space ${placement} ${className}`}>
      {placement === 'sidebar' && (
        <div className="ad-container sidebar-ad">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="YOUR-ADSENSE-ID"
               data-ad-slot="YOUR-SIDEBAR-AD-SLOT"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      )}

      {placement === 'feed' && (
        <div className="ad-container feed-ad">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="YOUR-ADSENSE-ID"
               data-ad-slot="YOUR-FEED-AD-SLOT"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      )}

      {placement === 'content' && (
        <div className="ad-container content-ad">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="YOUR-ADSENSE-ID"
               data-ad-slot="YOUR-CONTENT-AD-SLOT"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      )}
    </div>
  );
}

<style>
  .ad-space {
    width: 100%;
    margin: var(--space-md) 0;
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ad-container {
    background: var(--color-secondary);
    border: var(--border-brutal);
    box-shadow: var(--shadow-brutal);
    overflow: hidden;
  }

  .sidebar-ad {
    width: 300px;
    height: 250px;
  }

  .feed-ad {
    width: 728px;
    height: 90px;
    max-width: 100%;
  }

  .content-ad {
    width: 300px;
    height: 250px;
  }

  @media (max-width: 768px) {
    .feed-ad {
      width: 300px;
      height: 250px;
    }
  }
</style>
