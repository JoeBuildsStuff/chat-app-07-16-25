"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Building2, Calendar, File, ListTodo, Plus, Users } from "lucide-react"
import { SidebarLogo } from "./app-sidebar-logo"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { AuthButton } from "@/components/auth-button"

export function AppSidebar() {
  const pathname = usePathname()

  const handleCreateContact = () => {
    console.log("Create contact clicked")
  }

  const handleCreateCompany = () => {
    console.log("Create company clicked")
  }

  const handleCreateNote = () => {
    console.log("Create note clicked")
  }

  const handleCreateMeeting = () => {
    console.log("Create meeting clicked")
  }

  const handleCreateTask = () => {
    console.log("Create task clicked")
  }

  const relationshipItems = [
    {
      label: "People",
      href: "/workspace/person",
      icon: Users,
      action: handleCreateContact,
      actionAriaLabel: "Create new contact",
    },
    {
      label: "Companies",
      href: "/workspace/company",
      icon: Building2,
      action: handleCreateCompany,
      actionAriaLabel: "Create new company",
    },
  ]

  const activityItems = [
    {
      label: "Meetings",
      href: "/workspace/meeting",
      icon: Calendar,
      action: handleCreateMeeting,
      actionAriaLabel: "Create new meeting",
    },
    {
      label: "Notes",
      href: "/workspace/note",
      icon: File,
      action: handleCreateNote,
      actionAriaLabel: "Create new note",
    },
    {
      label: "Tasks",
      href: "/workspace/task",
      icon: ListTodo,
      action: handleCreateTask,
      actionAriaLabel: "Create new task",
    },
  ]

  const renderNavigationItems = (items: typeof relationshipItems) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton 
          asChild
          className={cn(
            "w-full justify-start",
            pathname.startsWith(item.href)
              ? "bg-muted/50 hover:bg-muted font-semibold"
              : "hover:bg-muted"
          )}
        >
          <Link href={item.href}>
            <item.icon className="size-3.5 mr-2 flex-none text-muted-foreground" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
        {item.action && (
          <SidebarMenuAction asChild>
            <button
              onClick={item.action}
              className="disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
              aria-label={item.actionAriaLabel}
            >
                <Plus className="size-4 text-muted-foreground" />
            </button>
          </SidebarMenuAction>
        )}
      </SidebarMenuItem>
    ))
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarLogo />
        </SidebarHeader>
        <SidebarContent className="flex flex-col">

          {/* Relationships */}
          <SidebarGroup>
            <SidebarGroupLabel>Relationships</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {renderNavigationItems(relationshipItems)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Activities */}
          <SidebarGroup>
            <SidebarGroupLabel>Activities</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {renderNavigationItems(activityItems)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

        </SidebarContent>
        <SidebarFooter>
          <AuthButton />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}