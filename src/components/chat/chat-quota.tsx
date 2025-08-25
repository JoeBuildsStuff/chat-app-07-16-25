'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Database, 
  Trash2, 
  AlertTriangle, 
  Info, 
  HardDrive,
  MessageSquare
} from 'lucide-react'
import { useChatStore } from '@/lib/chat/chat-store'
import { cn } from '@/lib/utils'

interface StorageUsage {
  totalSize: number
  sessionsCount: number
  messagesCount: number
  attachmentsCount: number
  attachmentsSize: number
  sessionsBreakdown: Array<{
    id: string
    title: string
    size: number
    messagesCount: number
    attachmentsCount: number
  }>
}

interface QuotaLimits {
  maxStorageSize: number
  maxSessions: number
  maxMessagesPerSession: number
  maxAttachmentSize: number
}

interface ChatQuotaProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const QUOTA_LIMITS: QuotaLimits = {
  maxStorageSize: 4 * 1024 * 1024, // 4MB
  maxSessions: 10,
  maxMessagesPerSession: 50,
  maxAttachmentSize: 1024 * 1024, // 1MB per attachment
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const getUsagePercentage = (used: number, total: number): number => {
  return Math.min((used / total) * 100, 100)
}

const getUsageColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-500'
  if (percentage >= 75) return 'text-orange-500'
  if (percentage >= 50) return 'text-yellow-500'
  return 'text-green-500'
}

const getUsageVariant = (percentage: number): "default" | "secondary" | "destructive" => {
  if (percentage >= 90) return 'destructive'
  if (percentage >= 75) return 'secondary'
  return 'default'
}

export function ChatQuota({ open, onOpenChange }: ChatQuotaProps = {}) {
  const { sessions, deleteSession } = useChatStore()
  const [storageUsage, setStorageUsage] = useState<StorageUsage | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)

  // Calculate storage usage
  useEffect(() => {
    const calculateUsage = (): StorageUsage => {
      const sessionsData = sessions.map(session => {
        const sessionSize = new Blob([JSON.stringify(session)]).size
        const attachmentsCount = session.messages.reduce((count, msg) => 
          count + (msg.attachments?.length || 0), 0
        )
        // Calculate attachments size (unused but kept for future use)
        const _attachmentsSize = session.messages.reduce((size, msg) => 
          size + (msg.attachments?.reduce((attSize, att) => 
            attSize + (att.data ? new Blob([att.data]).size : 0), 0
          ) || 0), 0
        )

        return {
          id: session.id,
          title: session.title,
          size: sessionSize,
          messagesCount: session.messages.length,
          attachmentsCount,
        }
      })

      const totalSize = new Blob([JSON.stringify({
        sessions: sessions,
        currentSessionId: useChatStore.getState().currentSessionId,
        layoutMode: useChatStore.getState().layoutMode,
      })]).size

      const totalMessages = sessions.reduce((count, session) => count + session.messages.length, 0)
      const totalAttachments = sessions.reduce((count, session) => 
        count + session.messages.reduce((msgCount, msg) => msgCount + (msg.attachments?.length || 0), 0), 0
      )
      const totalAttachmentsSize = sessions.reduce((size, session) => 
        size + session.messages.reduce((msgSize, msg) => 
          msgSize + (msg.attachments?.reduce((attSize, att) => 
            attSize + (att.data ? new Blob([att.data]).size : 0), 0
          ) || 0), 0
        ), 0
      )

      return {
        totalSize,
        sessionsCount: sessions.length,
        messagesCount: totalMessages,
        attachmentsCount: totalAttachments,
        attachmentsSize: totalAttachmentsSize,
        sessionsBreakdown: sessionsData,
      }
    }

    setStorageUsage(calculateUsage())
  }, [sessions])

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId)
    setShowClearDialog(true)
  }

  const confirmDeleteSession = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete)
      setSessionToDelete(null)
    }
    setShowClearDialog(false)
  }

  // Function to clear all sessions except current (unused but kept for future use)
  const _handleClearAllSessions = () => {
    // Clear all sessions except current
    const currentSessionId = useChatStore.getState().currentSessionId
    sessions.forEach(session => {
      if (session.id !== currentSessionId) {
        deleteSession(session.id)
      }
    })
  }

  if (!storageUsage) return null

  const storagePercentage = getUsagePercentage(storageUsage.totalSize, QUOTA_LIMITS.maxStorageSize)
  const sessionsPercentage = getUsagePercentage(storageUsage.sessionsCount, QUOTA_LIMITS.maxSessions)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HardDrive className="size-5" />
            Storage Quota
          </DialogTitle>
          <DialogDescription>
            Monitor your chat storage usage and manage your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Usage Summary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Overall Usage</h3>
              <Badge variant={getUsageVariant(storagePercentage)}>
                {formatBytes(storageUsage.totalSize)} / {formatBytes(QUOTA_LIMITS.maxStorageSize)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage</span>
                <span className={cn("font-medium", getUsageColor(storagePercentage))}>
                  {storagePercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">{storageUsage.sessionsCount}</div>
                <div className="text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{storageUsage.messagesCount}</div>
                <div className="text-muted-foreground">Messages</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{storageUsage.attachmentsCount}</div>
                <div className="text-muted-foreground">Attachments</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sessions Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Sessions</h3>
              <Badge variant={getUsageVariant(sessionsPercentage)}>
                {storageUsage.sessionsCount} / {QUOTA_LIMITS.maxSessions}
              </Badge>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {storageUsage.sessionsBreakdown.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-4 text-muted-foreground" />
                      <span className="font-medium truncate">{session.title}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{session.messagesCount} messages</span>
                      <span>{session.attachmentsCount} attachments</span>
                      <span>{formatBytes(session.size)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Storage Tips */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Info className="size-4" />
              Storage Tips
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>Large images and files consume more storage space</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>Older sessions are automatically trimmed to save space</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                <span>Consider deleting unused sessions to free up space</span>
              </div>
            </div>
          </div>

          {/* Warning if near limit */}
          {storagePercentage >= 75 && (
            <div className="p-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-orange-800 dark:text-orange-200">
                    Storage space running low
                  </div>
                  <div className="text-orange-700 dark:text-orange-300 mt-1">
                    You&apos;re using {storagePercentage.toFixed(1)}% of your storage quota. 
                    Consider deleting old sessions or clearing chat history.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo section for testing */}
          <Separator />
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Demo Actions</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Simulate adding large messages to trigger quota
                  const largeMessage = 'A'.repeat(100000) // 100KB message
                  for (let i = 0; i < 10; i++) {
                    useChatStore.getState().addMessage({
                      role: 'user',
                      content: `Large test message ${i + 1}: ${largeMessage}`,
                    })
                  }
                }}
              >
                Simulate Quota Exceeded
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clear all sessions
                  const { sessions, deleteSession } = useChatStore.getState()
                  sessions.forEach(session => {
                    deleteSession(session.id)
                  })
                }}
              >
                Clear All Sessions
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Session Confirmation Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this session? This action cannot be undone and will permanently remove all messages and attachments in this conversation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteSession} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  )
}
