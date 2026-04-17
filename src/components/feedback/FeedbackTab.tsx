'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MessageSquare,
  User,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Filter,
  TrendingUp,
  AlertCircle,
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
} from "@/components/ui/dialog"

const initialFeedback = [
  {
    id: 1,
    guestName: "Sarah Johnson",
    room: "302",
    type: "staff",
    staffMember: "Maria Garcia",
    rating: 5,
    message: "Maria was incredibly helpful during check-in. She made us feel so welcome!",
    timestamp: "2 min ago",
    status: "new",
    category: "Service",
  },
  {
    id: 2,
    guestName: "Michael Chen",
    room: "415",
    type: "facility",
    staffMember: null,
    rating: 3,
    message: "The pool area could use more seating. It was quite crowded during peak hours.",
    timestamp: "15 min ago",
    status: "reviewed",
    category: "Facilities",
  },
  {
    id: 3,
    guestName: "Emma Williams",
    room: "201",
    type: "staff",
    staffMember: "James Wilson",
    rating: 5,
    message: "James from housekeeping did an exceptional job. Room was spotless!",
    timestamp: "32 min ago",
    status: "resolved",
    category: "Housekeeping",
  },
  {
    id: 4,
    guestName: "David Park",
    room: "508",
    type: "service",
    staffMember: null,
    rating: 2,
    message: "Room service took over an hour to arrive. Food was cold when it got here.",
    timestamp: "1 hour ago",
    status: "urgent",
    category: "Room Service",
  },
  {
    id: 5,
    guestName: "Lisa Thompson",
    room: "612",
    type: "staff",
    staffMember: "Carlos Rodriguez",
    rating: 4,
    message: "Carlos at the concierge desk gave great restaurant recommendations!",
    timestamp: "2 hours ago",
    status: "reviewed",
    category: "Concierge",
  },
]

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewed: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  urgent: "bg-red-100 text-red-800",
}

type StatsDialogType = "total" | "avgRating" | "positive" | "needsAttention" | null

export default function FeedbackTab() {
  const [feedback, setFeedback] = useState(initialFeedback)
  const [filter, setFilter] = useState("all")
  const [statsDialog, setStatsDialog] = useState<StatsDialogType>(null)

  const filteredFeedback = filter === "all"
    ? feedback
    : feedback.filter(f => f.status === filter)

  const stats = {
    total: feedback.length,
    avgRating: (feedback.reduce((acc, f) => acc + f.rating, 0) / feedback.length).toFixed(1),
    positive: feedback.filter(f => f.rating >= 4).length,
    needsAttention: feedback.filter(f => f.rating <= 2).length,
  }

  const getStatsDialogContent = () => {
    switch (statsDialog) {
      case "total":
        return {
          title: "Total Feedback Overview",
          items: feedback.map(f => ({
            name: f.guestName,
            room: f.room,
            rating: f.rating,
            message: f.message,
            status: f.status,
          }))
        }
      case "avgRating":
        const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
          rating: r,
          count: feedback.filter(f => f.rating === r).length,
          percentage: Math.round((feedback.filter(f => f.rating === r).length / feedback.length) * 100)
        }))
        return {
          title: "Rating Distribution",
          distribution: ratingDistribution
        }
      case "positive":
        return {
          title: "Positive Feedback (4-5 Stars)",
          items: feedback.filter(f => f.rating >= 4).map(f => ({
            name: f.guestName,
            room: f.room,
            rating: f.rating,
            message: f.message,
            staffMember: f.staffMember,
          }))
        }
      case "needsAttention":
        return {
          title: "Needs Attention (1-2 Stars)",
          items: feedback.filter(f => f.rating <= 2).map(f => ({
            name: f.guestName,
            room: f.room,
            rating: f.rating,
            message: f.message,
            category: f.category,
            status: f.status,
          }))
        }
      default:
        return null
    }
  }

  const updateStatus = (id: number, status: string) => {
    setFeedback(feedback.map(f => f.id === id ? { ...f, status } : f))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
          Guest Feedback
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time feedback from your guests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("total")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("avgRating")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgRating}</p>
                <p className="text-xs text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("positive")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.positive}</p>
                <p className="text-xs text-muted-foreground">Positive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
          onClick={() => setStatsDialog("needsAttention")}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.needsAttention}</p>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
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
            {statsDialog === "avgRating" ? (
              <div className="space-y-3">
                {getStatsDialogContent()?.distribution?.map((item: { rating: number; count: number; percentage: number }) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              getStatsDialogContent()?.items?.map((item: { name: string; room: string; rating: number; message: string; status?: string; staffMember?: string | null; category?: string }, index: number) => (
                <div key={index} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">Room {item.room}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{item.message}</p>
                  {item.staffMember && (
                    <p className="text-xs text-primary mt-1">Staff: {item.staffMember}</p>
                  )}
                  {item.status && (
                    <Badge className="mt-2 text-xs" variant="secondary">{item.status}</Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Feedback</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-4 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{item.guestName}</h3>
                          <span className="text-sm text-muted-foreground">Room {item.room}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={statusColors[item.status]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>

                  <p className="mt-4 text-foreground leading-relaxed">
                    {item.message}
                  </p>

                  {item.staffMember && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium">Staff mentioned:</span> {item.staffMember}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {item.timestamp}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status !== "resolved" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(item.id, "reviewed")}
                            className="text-xs"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Mark Reviewed
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(item.id, "resolved")}
                            className="text-xs"
                          >
                            Resolve
                          </Button>
                        </>
                      )}
                      {item.rating <= 2 && item.status !== "urgent" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateStatus(item.id, "urgent")}
                          className="text-xs"
                        >
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Flag Urgent
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
