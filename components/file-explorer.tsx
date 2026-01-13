"use client"

import { useState } from "react"
import { PixelFile, PixelFolder, PixelFolderOpen, PixelChevron } from "@/components/pixel-icons"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  path: string
}

const demoFileStructure: FileNode[] = [
  {
    name: "app",
    type: "folder",
    path: "/app",
    children: [
      { name: "layout.tsx", type: "file", path: "/app/layout.tsx" },
      { name: "page.tsx", type: "file", path: "/app/page.tsx" },
      { name: "globals.css", type: "file", path: "/app/globals.css" },
      {
        name: "posts",
        type: "folder",
        path: "/app/posts",
        children: [
          { name: "page.tsx", type: "file", path: "/app/posts/page.tsx" },
          {
            name: "[slug]",
            type: "folder",
            path: "/app/posts/[slug]",
            children: [{ name: "page.tsx", type: "file", path: "/app/posts/[slug]/page.tsx" }],
          },
        ],
      },
      {
        name: "about",
        type: "folder",
        path: "/app/about",
        children: [{ name: "page.tsx", type: "file", path: "/app/about/page.tsx" }],
      },
    ],
  },
  {
    name: "components",
    type: "folder",
    path: "/components",
    children: [
      { name: "blog-header.tsx", type: "file", path: "/components/blog-header.tsx" },
      { name: "blog-footer.tsx", type: "file", path: "/components/blog-footer.tsx" },
      { name: "post-card.tsx", type: "file", path: "/components/post-card.tsx" },
      { name: "dot-decoration.tsx", type: "file", path: "/components/dot-decoration.tsx" },
      { name: "pixel-icons.tsx", type: "file", path: "/components/pixel-icons.tsx" },
    ],
  },
  {
    name: "lib",
    type: "folder",
    path: "/lib",
    children: [
      { name: "demo-posts.ts", type: "file", path: "/lib/demo-posts.ts" },
      { name: "utils.ts", type: "file", path: "/lib/utils.ts" },
    ],
  },
  {
    name: "public",
    type: "folder",
    path: "/public",
    children: [],
  },
]

function FileTreeItem({
  node,
  level = 0,
  selectedPath,
  onSelect,
}: {
  node: FileNode
  level?: number
  selectedPath: string | null
  onSelect: (path: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const isSelected = selectedPath === node.path
  const hasChildren = node.type === "folder" && node.children && node.children.length > 0

  return (
    <div>
      <button
        onClick={() => {
          if (node.type === "folder") {
            setIsExpanded(!isExpanded)
          }
          onSelect(node.path)
        }}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors",
          "hover:bg-sidebar-accent text-sidebar-foreground",
          isSelected && "bg-sidebar-primary/10 text-sidebar-primary font-medium",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.type === "folder" && hasChildren && (
          <PixelChevron
            className={cn("w-3 h-3 text-sidebar-foreground/60 transition-transform", isExpanded && "rotate-90")}
          />
        )}
        {node.type === "folder" && !hasChildren && <div className="w-3" />}
        {node.type === "folder" ? (
          isExpanded ? (
            <PixelFolderOpen className="w-4 h-4 text-sidebar-foreground/80 shrink-0" />
          ) : (
            <PixelFolder className="w-4 h-4 text-sidebar-foreground/80 shrink-0" />
          )
        ) : (
          <PixelFile className="w-4 h-4 text-sidebar-foreground/60 shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={child.path || index}
              node={child}
              level={level + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileExplorer() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen sticky top-0 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-12" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border shrink-0">
        {!isCollapsed && (
          <span className="text-[10px] font-[family-name:var(--font-silkscreen)] tracking-wider text-sidebar-foreground/80 uppercase">
            Explorer
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-sidebar-accent rounded transition-colors ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PixelChevron
            className={cn(
              "w-3 h-3 text-sidebar-foreground/60 transition-transform",
              isCollapsed ? "rotate-0" : "rotate-180",
            )}
          />
        </button>
      </div>

      {/* File Tree */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {demoFileStructure.map((node) => (
            <FileTreeItem key={node.path} node={node} selectedPath={selectedPath} onSelect={setSelectedPath} />
          ))}
        </div>
      )}

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center gap-2 py-4">
          <PixelFolder className="w-5 h-5 text-sidebar-foreground/60" />
          <PixelFile className="w-5 h-5 text-sidebar-foreground/60" />
        </div>
      )}
    </aside>
  )
}
