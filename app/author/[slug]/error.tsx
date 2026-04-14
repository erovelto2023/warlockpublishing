'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AuthorError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Author Page Error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Something went wrong</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          We encountered an error while loading this author profile. This could be due to a temporary connection issue.
        </p>
        {error.digest && (
          <p className="text-xs text-stone-300 font-mono mt-4">Error ID: {error.digest}</p>
        )}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-stone-900 text-white px-6 py-3 font-sans text-xs font-bold tracking-widest hover:bg-stone-700 transition-all"
        >
          TRY AGAIN
        </button>
        <Link href="/">
          <button className="border border-stone-300 px-6 py-3 font-sans text-xs font-bold tracking-widest hover:border-stone-900 hover:bg-stone-50 transition-all uppercase">
            RETURN HOME
          </button>
        </Link>
      </div>
    </div>
  )
}
