import { getCurrentProfile } from '@/lib/auth/roles';
import { CampMapHub } from '@/components/hub/CampMapHub';

export default async function HomePage() {
  const profile = await getCurrentProfile();
  return <CampMapHub profile={profile} />;
}
