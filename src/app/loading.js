import { SectionSkeleton } from '../components/skeletons'

// Shown while a page is being fetched (home, or any route without its own
// loading state).
export default function Loading () {
  return (
    <>
      <SectionSkeleton count={4} />
      <SectionSkeleton count={8} />
    </>
  )
}
