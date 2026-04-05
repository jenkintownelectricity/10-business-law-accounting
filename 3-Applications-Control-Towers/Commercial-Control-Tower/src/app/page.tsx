import { WorkspaceShell } from '@/components/layout/WorkspaceShell';
import { OverviewDashboard } from '@/components/pages/OverviewDashboard';

export default function HomePage() {
  return (
    <WorkspaceShell activeNav="overview">
      <OverviewDashboard />
    </WorkspaceShell>
  );
}
