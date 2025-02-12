import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./AdSpace.css";

interface AdSpaceProps {
  placement: "sidebar" | "feed" | "content";
  className?: string;
}

// Define the window interface to avoid using 'any'
interface WindowWithAds extends Window {
  adsbygoogle?: any[];
}

export default function AdSpace({ placement, className = "" }: AdSpaceProps) {
  const [showAd, setShowAd] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
    initializeAds();
  }, []);

  async function checkSubscriptionStatus() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user?.id) {
      setUserId(session.user.id);
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .single();

      setShowAd(!subscription);
    }
  }

  function initializeAds() {
    try {
      if (typeof window !== "undefined") {
        const windowWithAds = window as WindowWithAds;
        if (windowWithAds.adsbygoogle) {
          windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || [];
          windowWithAds.adsbygoogle.push({});
        }
      }
    } catch (error) {
      console.error("Error initializing ads:", error);
    }
  }

  if (!showAd) return null;

  return (
    <div className={`ad-space ${placement} ${className}`}>
      {placement === "sidebar" && (
        <div className="ad-container sidebar-ad">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="YOUR-ADSENSE-ID"
            data-ad-slot="YOUR-SIDEBAR-AD-SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {placement === "feed" && (
        <div className="ad-container feed-ad">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="YOUR-ADSENSE-ID"
            data-ad-slot="YOUR-FEED-AD-SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}

      {placement === "content" && (
        <div className="ad-container content-ad">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="YOUR-ADSENSE-ID"
            data-ad-slot="YOUR-CONTENT-AD-SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );
}
