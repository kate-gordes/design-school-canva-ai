import AppSection from '@/pages/Home/Apps/components/AppSection';

// Example of an empty app section to demonstrate empty state
export default function EmptyAppsSection(): React.ReactNode {
  return (
    <AppSection
      title="Audio and voiceover"
      subtitle="Coming soon - audio and voiceover apps"
      apps={[]} // Empty array to show empty state
      emptyStateMessage="No audio apps are available yet. Check back soon!"
    />
  );
}

// Example of loading state (could be used in a different context)
export function LoadingAppsSection(): React.ReactNode {
  return (
    <AppSection
      title="Loading apps..."
      apps={[]}
      loading={true} // Show loading placeholders
    />
  );
}
