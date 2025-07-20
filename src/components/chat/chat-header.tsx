'use client'

import { X, Trash2, ChevronLeft, SquarePen, Download, Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/lib/chat/chat-store'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuShortcut } from '@/components/ui/dropdown-menu'
import { useState, useRef, useEffect } from 'react'

export function ChatHeader() {
  const { setOpen, setMinimized, clearMessages, setShowHistory, createSession, currentSession, updateSessionTitle } = useChatStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setOpen(false)
    setMinimized(false)
  }

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      clearMessages()
    }
  }

  const handleNewChat = () => {
    createSession()
  }

  const handleDownloadChat = () => {
    console.log("Download chat")
  }

  const handleShowHistory = () => {
    setShowHistory(true)
  }

  const handleTitleClick = () => {
    if (currentSession) {
      setEditTitle(currentSession.title)
      setIsEditingTitle(true)
    }
  }

  const handleTitleSubmit = () => {
    if (currentSession && editTitle.trim()) {
      updateSessionTitle(currentSession.id, editTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setIsEditingTitle(false)
    setEditTitle('')
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditingTitle])

  return (
    <div className={cn(
      "flex items-center justify-between",
      "p-2 border-b",
      "rounded-t-xl"
    )}>
      {/* Left section - Navigate to historical chats */}
      <div className="flex items-center flex-1 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 flex-shrink-0"
          onClick={handleShowHistory}
          title="View chat history"
        >
          <ChevronLeft className="size-5 text-primary flex-shrink-0" />
        </Button>

        {/* Chat Title */}
        <div className="flex-1 min-w-0 ml-2">
          {isEditingTitle ? (
            <Input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              className="h-7 text-sm font-medium border-none shadow-none px-1 py-0 focus-visible:ring-0 focus-visible:border-none bg-transparent"
              placeholder="Enter chat title..."
            />
          ) : (
            <Button
              variant="ghost"
              onClick={handleTitleClick}
              className="h-7 w-full justify-start text-left truncate text-sm font-medium px-1 py-0 hover:bg-muted/50"
              title={currentSession?.title || 'New Chat'}
            >
              {currentSession?.title || 'New Chat'}
            </Button>
          )}
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="More actions"
            >
              <Ellipsis className="size-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleNewChat}>
                <SquarePen className="mr-2 size-4" />
                New chat
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadChat}>
                <Download className="mr-2 size-4" />
                Download chat
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleClearChat}>
                <Trash2 className="mr-2 size-4" />
                Clear chat
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleClose}
          title="Close"
        >
          <X className="size-4 shrink-0" />
        </Button>
      </div>
    </div>
  )
} 