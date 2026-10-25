import { redirect } from 'next/navigation'
import UpdateProfileForm from '../../../components/update-profile-form'
import { getSession } from '../../../lib/session'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'তথ্য আপডেট | বাজার দর'
}

export default async function UpdateProfilePage () {
  const session = await getSession()

  if (!session) {
    redirect('/signin?reason=login-required&callbackURL=%2Fprofile%2Fupdate')
  }

  return <UpdateProfileForm currentName={session.user.name ?? ''} />
}
