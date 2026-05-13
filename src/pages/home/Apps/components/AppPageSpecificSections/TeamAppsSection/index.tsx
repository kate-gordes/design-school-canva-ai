import AppSection from '@/pages/Home/Apps/components/AppSection';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export default function TeamAppsSection(): React.ReactNode {
  const teamAppsData: AppSectionData[] = [
    {
      title: 'Random Data (Test)',
      description: 'Returns completely random data',
      thumbnail: '',
      onClick: () => console.log('Random Data Test clicked'),
    },
    {
      title: 'Jira (Canva Beta)',
      description: 'Bring your Jira work item data to Canva',
      thumbnail: '',
      onClick: () => console.log('Jira clicked'),
    },
    {
      title: 'Mermaid',
      description: 'Use Mermaid.js in your Canva designs.',
      thumbnail: '',
      onClick: () => console.log('Mermaid clicked'),
    },
    {
      title: 'Canviz',
      description: 'Send data visualisations directly from R/Python',
      thumbnail: '',
      onClick: () => console.log('Canviz clicked'),
    },
    {
      title: 'Canvaworld',
      description: 'Add people profile images from Canvaworld',
      thumbnail: '',
      onClick: () => console.log('Canvaworld clicked'),
    },
    {
      title: 'Test Poll',
      description: "This is Sharon's quick Canva API interactive poll",
      thumbnail: '',
      onClick: () => console.log('Test Poll clicked'),
    },
  ];

  return (
    <AppSection
      title="Team apps"
      subtitle="These apps are enabled by your admins, and available to you and your team on Canva"
      apps={teamAppsData}
      showSeeAll={true}
      onSeeAllClick={() => console.log('See all team apps')}
    />
  );
}
