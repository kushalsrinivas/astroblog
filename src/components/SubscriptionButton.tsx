import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
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

      setIsSubscribed(!!subscription);
    }
  }

  async function handleSubscription() {
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      // Initialize payment process
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId: 'price_monthly_ad_free', // Your price ID
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.PUBLIC_STRIPE_KEY);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error creating subscription:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSubscription}
      disabled={loading || isSubscribed}
      className={`subscription-button ${isSubscribed ? 'subscribed' : ''}`}
    >
      {loading ? 'Processing...' : isSubscribed ? 'Subscribed' : 'Go Ad-Free'}
    </button>
  );
}

<style>
  .subscription-button {
    padding: var(--space-sm) var(--space-md);
    border: var(--border-brutal);
    background: var(--color-accent);
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .subscription-button:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-brutal);
  }

  .subscription-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .subscription-button.subscribed {
    background: var(--color-secondary);
    color: var(--color-text);
  }
</style>
