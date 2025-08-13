'use client';

export function DashboardScientificBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle grid lines - static */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(75, 85, 99, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(75, 85, 99, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Subtle wave patterns - static */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(75, 85, 99, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(75, 85, 99, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(75, 85, 99, 0.1) 0%, transparent 50%)
            `,
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* DNA-like helix pattern - static */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(75, 85, 99, 0.05) 2px,
                rgba(75, 85, 99, 0.05) 4px
              )
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-gray-100/20 dark:from-gray-900/30 dark:via-transparent dark:to-gray-800/20" />
    </div>
  );
}
