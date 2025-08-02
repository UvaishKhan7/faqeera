import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <p><strong>Name:</strong> {session.user.name || 'Not provided'}</p>
      <p><strong>Email:</strong> {session.user.email}</p>
    </div>
  );
}