'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BedDouble,
  Droplets,
  UtensilsCrossed,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Phone,
  Plus,
  Filter,
  Bell,
  Coffee,
  Wifi,
  Car,
  Bath,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type RequestStatsType = "pending" | "inProgress" | "completed" | "highPriority" | null

const requestTypes = [
  { id: "pillows", label: "Extra Pillows", icon: BedDouble, color: "bg-blue-100 text-blue-700" },
  { id: "towels", label: "More Towels", icon: Droplets, color: "bg-cyan-100 text-cyan-700" },
  { id: "roomservice", label: "Room Service", icon: UtensilsCrossed, color: "bg-orange-100 text-orange-700" },
  { id: "cleaning", label: "Housekeeping", icon: Sparkles, color: "bg-green-100 text-green-700" },
  { id: "coffee", label: "Coffee/Tea", icon: Coffee, color: "bg-amber-100 text-amber-700" },
  { id: "wifi", label: "WiFi Help", icon: Wifi, color: "bg-purple-100 text-purple-700" },
  { id: "valet", label: "Valet Service", icon: Car, color: "bg-slate-100 text-slate-700" },
  { id: "amenities", label: "Bath Amenities", icon: Bath, color: "bg-pink-100 text-pink-700" },
]

const initialRequests = [
  {
    id: 1,
    type: "pillows",
    guestName: "Sarah Johnson",
    room: "302",
    note: "2 extra firm pillows please",
    status: "pending",
    timestamp: "Just now",
    priority: "normal",
  },
  {
    id: 2,
    type: "roomservice",
    guestName: "Michael Chen",
    room: "415",
    note: "Club sandwich and sparkling water",
    status: "in-progress",
    timestamp: "5 min ago",
    priority: "normal",
    assignedTo: "Kitchen Staff",
  },
  {
    id: 3,
    type: "towels",
    guestName: "Emma Williams",
    room: "201",
    note: "Fresh bath towels",
    status: "completed",
    timestamp: "15 min ago",
    priority: "normal",
  },
  {
    id: 4,
    type: "cleaning",
    guestName: "David Park",
    room: "508",
    note: "Deep clean requested before check-out",
    status: "pending",
    timestamp: "20 min ago",
    priority: "high",
  },
  {
    id: 5,
    type: "wifi",
    guestName: "Lisa Thompson",
    room: "612",
    note: "Cannot connect laptop to WiFi",
    status: "in-progress",
    timestamp: "30 min ago",
    priority: "normal",
    assignedTo: "IT Support",
  },
  {
    id: 6,
    type: "coffee",
    guestName: "James Wilson",
    room: "105",
    note: "Espresso machine pods refill",
    status: "completed",
    timestamp: "45 min ago",
    priority: "normal",
  },
]

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  pending: { color: "bg-amber-100 text-amber-800", icon: Clock },
  "in-progress": { color: "bg-blue-100 text-blue-800", icon: Loader2 },
  completed: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
}

export default function RequestsTab() {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statsDialog, setStatsDialog] = useState<RequestStatsType>(null)
  const [newRequest, setNewRequest] = useState({
    type: "",
    guestName: "",
    room: "",
    note: "",
    priority: "normal",
  })

  const filteredRequests = filter === "all"
    ? requests
    : requests.filter(r => r.status === filter)

  const stats = {
    pending: requests.filter(r => r.status === "pending").length,
    inProgress: requests.filter(r => r.status === "in-progress").length,
    completed: requests.filter(r => r.status === "completed").length,
    highPriority: requests.filter(r => r.priority === "high" && r.status !== "completed").length,
  }

  const getRequestType = (typeId: string) => {
    return requestTypes.find(t => t.id === typeId) || requestTypes[0]
  }

  const getStatsDialogContent = () => {
    switch (statsDialog) {
      case "pending":
        return { title: "Pending Requests", items: requests.filter(r => r.status === "pending") }
      case "inProgress":
        return { title: "In Progress Requests", items: requests.filter(r => r.status === "in-progress") }
      case "completed":
        return { title: "Completed Requests", items: requests.filter(r => r.status === "completed") }
      case "highPriority":
        return { title: "High Priority Requests", items: requests.filter(r => r.priority === "high" && r.status !== "completed") }
      default:
        return null
    }
  }

  const handleAddRequest = () => {
    if (newRequest.type && newRequest.guestName && newRequest.room) {
      setRequests([
        {
          id: requests.length + 1,
          type: newRequest.type,
          guestName: newRequest.guestName,
          room: newRequest.room,
          note: newRequest.note,
          status: "pending",
          timestamp: "Just now",
          priority: newRequest.priority,
        },
        ...requests,
      ])
      setNewRequest({ type: "", guestName: "", room: "", note: "", priority: "normal" })
      setDialogOpen(false)
    }
  }

  const updateStatus = (id: number, status: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
            Quick Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage guest service requests in real-time
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">Create New Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Request Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {requestTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewRequest({...newRequest, type: type.id})}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                        newRequest.type === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <type.icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-center leading-tight">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Guest Name</label>
                  <Input
                    placeholder="Enter name"
                    value={newRequest.guestName}
                    onChange={(e) => setNewRequest({...newRequest, guestName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Room Number</label>
                  <Input
                    placeholder="e.g. 302"
                    value={newRequest.room}
                    onChange={(e) => setNewRequest({...newRequest, room: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Priority</label>
                <Select
                  value={newRequest.priority}
                  onValueChange={(v) => setNewRequest({...newRequest, priority: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Additional Notes</label>
                <Textarea
                  placeholder="Special instructions or details..."
                  value={newRequest.note}
                  onChange={(e) => setNewRequest({...newRequest, note: e.target.value})}
                  rows={2}
                />
              </div>
              <Button onClick={handleAddRequest} className="w-full bg-primary hover:bg-primary/90">
                Create Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("pending")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("inProgress")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("completed")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("highPriority")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.highPriority}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Dialog */}
      <Dialog open={statsDialog !== null} onOpenChange={(open) => !open && setStatsDialog(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{getStatsDialogContent()?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {getStatsDialogContent()?.items?.map((item) => {
              const reqType = getRequestType(item.type)
              return (
                <div key={item.id} className="p-3 rounded-lg border border-border flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${reqType.color} flex items-center justify-center shrink-0`}>
                    <reqType.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{reqType.label}</span>
                      {item.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.note}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{item.guestName}</span>
                      <span>Room {item.room}</span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            {getStatsDialogContent()?.items?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No requests found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
            {requestTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setNewRequest({...newRequest, type: type.id})
                  setDialogOpen(true)
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-center font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.map((request) => {
          const reqType = getRequestType(request.type)
          const StatusIcon = statusConfig[request.status]?.icon || Clock

          return (
            <Card key={request.id} className={request.priority === "high" ? "border-red-200 bg-red-50/30" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${reqType.color} flex items-center justify-center shrink-0`}>
                    <reqType.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{reqType.label}</h3>
                          {request.priority === "high" && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{request.note}</p>
                      </div>
                      <Badge className={statusConfig[request.status]?.color}>
                        <StatusIcon className={`h-3 w-3 mr-1 ${request.status === "in-progress" ? "animate-spin" : ""}`} />
                        {request.status === "in-progress" ? "In Progress" : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {request.guestName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        Room {request.room}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {request.timestamp}
                      </div>
                    </div>
                    {"assignedTo" in request && request.assignedTo && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Assigned to: <span className="font-medium">{request.assignedTo}</span>
                      </p>
                    )}
                  </div>
                  {request.status !== "completed" && (
                    <div className="flex flex-col gap-2 shrink-0">
                      {request.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(request.id, "in-progress")}
                          className="bg-primary hover:bg-primary/90 text-xs"
                        >
                          Start
                        </Button>
                      )}
                      {request.status === "in-progress" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(request.id, "completed")}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
