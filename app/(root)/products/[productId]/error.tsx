'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Product Page Error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800">Product Unavailable</h2>
        <p className="text-stone-500 max-w-md mx-auto">
          We encountered an issue while loading this product. It might be temporarily unavailable or the link may be outdated.
        </p>
        {error.digest && (
          <p className="text-xs text-stone-300 font-mono mt-4">Error ID: {error.digest}</p>
        )}
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-stone-900 text-white px-6 py-3 font-sans text-xs font-bold tracking-widest hover:bg-stone-700 transition-all font-bold"
        >
          REFRESH PAGE
        </button>
        <Link href="/products">
          <button className="border border-stone-300 px-6 py-3 font-sans text-xs font-bold tracking-widest hover:border-stone-900 hover:bg-stone-50 transition-all uppercase font-bold">
            BROWSE MARKETPLACE
          </button>
        </Link>
      </div>
    </div>
  )
}
