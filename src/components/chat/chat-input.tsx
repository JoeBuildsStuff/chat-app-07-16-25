'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Loader2, ArrowUp, CornerRightUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChat } from '@/hooks/use-chat'
import { useChatStore } from '@/lib/chat/chat-store'
import { cn } from '@/lib/utils'

export function ChatInput() {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage } = useChat()
  const { isLoading } = useChatStore()

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    setInput('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      await sendMessage(trimmedInput)
    } finally {
      // Focus back to input
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // Auto-resize
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  return (
    <div className="p-2 space-y-2">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about your data..."
            disabled={isLoading}
            className={cn(
              "min-h-[40px] max-h-[120px]",
              "resize-none",
              "border-input",
              "focus:border-primary",
              "transition-colors"
            )}
            rows={1}
          />
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CornerRightUp className="size-4 shrink-0" strokeWidth={1.5}/>
          )}
        </Button>
      </div>
    </div>
  )
} 