'use client'

import { useChatStore } from '@/lib/chat/chat-store'
import { cn } from '@/lib/utils'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatMessagesList } from '@/components/chat/chat-messages-list'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatHistory } from '@/components/chat/chat-history'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ChatPanel() {
  const { isOpen, isMinimized, showHistory } = useChatStore()

  return (
    <div 
      className={cn(
        "fixed bottom-2 right-2 z-40",
        "w-full sm:w-96 h-full sm:h-[600px]",
        "bg-background border border-border rounded-2xl",
        "shadow-2xl",
        "flex flex-col",
        "transition-all duration-300 ease-in-out",
        // Slide-in animation from right
        isOpen && !isMinimized 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0",
        // Handle visibility
        !isOpen && "pointer-events-none"
      )}
    >
      {showHistory ? (
        // Chat History View
        <ChatHistory />
      ) : (
        // Regular Chat View
        <>
          {/* Chat Header */}
          <ChatHeader />
          
          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 h-full">
              <div className="p-3">
                <ChatMessagesList />
              </div>
            </ScrollArea>
          </div>
          
          {/* Input Area */}
          <div className="bg-transparent">
            <ChatInput />
          </div>
        </>
      )}
    </div>
  )
} 