interface ViewCounterProps {
  count: number;
}

export default function ViewCounter({ count }: ViewCounterProps) {
  return (
    <div className="view-counter">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{count}</span>
    </div>
  );
}

<style>
  .view-counter {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm);
    color: var(--color-text);
    opacity: 0.8;
  }
</style>
