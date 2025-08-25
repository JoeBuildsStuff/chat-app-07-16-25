'use client'

import { useEffect, useState } from 'react'
import { useChatStore } from '@/lib/chat/chat-store'
import { toast } from 'sonner'

export function useChatQuota() {
  const { getStorageUsage, isStorageQuotaExceeded, clearOldSessions } = useChatStore()
  const [lastWarning, setLastWarning] = useState<number>(0)

  useEffect(() => {
    const checkQuota = () => {
      const usage = getStorageUsage()
      const now = Date.now()

      console.log('usage', usage)

      // Show warning at 90% usage (but not more than once per hour)
      if (usage.usagePercentage >= 90 && now - lastWarning > 3600000) {
        toast.warning(`Storage space running low (${usage.usagePercentage.toFixed(1)}% used)`, {
          description: 'Consider clearing old chat sessions to free up space.',
          duration: 8000,
        })
        setLastWarning(now)
      }

      // Show critical warning at 95% usage
      if (usage.usagePercentage >= 95 && now - lastWarning > 1800000) {
        toast.error(`Storage quota critical (${usage.usagePercentage.toFixed(1)}% used)`, {
          description: 'Old sessions will be automatically cleared to make room for new messages.',
          duration: 10000,
        })
        setLastWarning(now)
      }

      // Auto-clear if quota exceeded
      if (isStorageQuotaExceeded()) {
        toast.error('Storage quota exceeded', {
          description: 'Old chat sessions have been automatically cleared to free up space.',
          duration: 8000,
        })
        clearOldSessions(2)
      }
    }

    // Check quota every 30 seconds
    const interval = setInterval(checkQuota, 30000)
    checkQuota() // Initial check

    return () => clearInterval(interval)
  }, [getStorageUsage, isStorageQuotaExceeded, clearOldSessions, lastWarning])

  return {
    getStorageUsage,
    isStorageQuotaExceeded,
    clearOldSessions,
  }
}
