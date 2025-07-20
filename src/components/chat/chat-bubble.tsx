'use client'

import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/lib/chat/chat-store'
import { cn } from '@/lib/utils'

export function ChatBubble() {
  const { isOpen, isMinimized, setOpen, setMinimized } = useChatStore()
  
  const handleToggle = () => {
    if (isOpen && !isMinimized) {
      setMinimized(true)
    } else {
      setOpen(true)
      setMinimized(false)
    }
  }

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(false)
    setMinimized(false)
  }

  // If chat is open and not minimized, don't show the bubble
  if (isOpen && !isMinimized) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Main bubble button */}
      <div 
        className={cn(
          "relative group cursor-pointer",
          "transition-all duration-300 ease-in-out",
          "hover:scale-110"
        )}
        onClick={handleToggle}
      >
        <Button
          variant="outline"
          className="rounded-full size-12"
        >
          <MessageCircle className="size-6 shrink-0" strokeWidth={1.5}/>
        </Button>
        
        {/* Close button when minimized */}
        {isMinimized && (
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "absolute -top-2 -right-2",
              "h-6 w-6 rounded-full p-0",
              "bg-background border-border",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-200"
            )}
            onClick={handleClose}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute bottom-full right-0 mb-2",
        "bg-popover text-popover-foreground",
        "px-3 py-2 rounded-md text-sm",
        "shadow-md border",
        "opacity-0 group-hover:opacity-100",
        "transition-opacity duration-200",
        "pointer-events-none",
        "whitespace-nowrap"
      )}>
        {isMinimized ? 'Open Chat' : 'Start Conversation'}
      </div>
    </div>
  )
} 