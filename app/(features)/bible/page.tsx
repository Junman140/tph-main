import { Suspense } from 'react'
import BibleContent from './BibleContent'

export default function BiblePage() {
  return (
    <div>
      <Suspense fallback={<div>Loading Bible content...</div>}>
        <BibleContent />
      </Suspense>
    </div>
  )
} 