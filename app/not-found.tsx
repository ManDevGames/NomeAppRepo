import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-5">
      <div className="max-w-md text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal-900">Page not found</h1>
        <p className="mt-3 text-sm sm:text-base text-charcoal-600">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-rose-400 px-6 py-3 text-sm font-medium text-white hover:bg-rose-500"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
