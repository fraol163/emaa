'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  GraduationCap,
  Star,
  Trophy,
  BookOpen,
  Clock,
  Award,
  Users,
  Search,
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
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type StaffStatsType = "total" | "graduated" | "learning" | "avgRating" | null

const staffMembers = [
  { id: 1, name: "Maria Garcia", role: "Front Desk", department: "Reception", avatar: null, status: "graduated", rating: 4.9, feedbackCount: 127, coursesCompleted: 8, coursesTotal: 8, badges: ["Customer Service Star", "Quick Learner"], joinDate: "Jan 2023", currentCourse: null },
  { id: 2, name: "James Wilson", role: "Housekeeping Lead", department: "Housekeeping", avatar: null, status: "graduated", rating: 4.8, feedbackCount: 89, coursesCompleted: 6, coursesTotal: 6, badges: ["Excellence Award", "Team Player"], joinDate: "Mar 2022", currentCourse: null },
  { id: 3, name: "Carlos Rodriguez", role: "Concierge", department: "Guest Services", avatar: null, status: "learning", rating: 4.5, feedbackCount: 64, coursesCompleted: 4, coursesTotal: 7, badges: ["Rising Star"], joinDate: "Aug 2023", currentCourse: "Advanced Guest Relations" },
  { id: 4, name: "Emily Chen", role: "Room Service", department: "Food & Beverage", avatar: null, status: "learning", rating: 4.3, feedbackCount: 42, coursesCompleted: 3, coursesTotal: 6, badges: [], joinDate: "Nov 2023", currentCourse: "Food Safety Fundamentals" },
  { id: 5, name: "David Thompson", role: "Night Manager", department: "Management", avatar: null, status: "graduated", rating: 4.7, feedbackCount: 156, coursesCompleted: 10, coursesTotal: 10, badges: ["Leadership Pro", "5-Star Service", "Mentor"], joinDate: "Jun 2021", currentCourse: null },
  { id: 6, name: "Sophie Martinez", role: "Spa Receptionist", department: "Wellness", avatar: null, status: "learning", rating: 4.4, feedbackCount: 38, coursesCompleted: 2, coursesTotal: 5, badges: ["Friendly Face"], joinDate: "Jan 2024", currentCourse: "Wellness & Hospitality" },
  { id: 7, name: "Robert Kim", role: "Chef de Partie", department: "Food & Beverage", avatar: null, status: "graduated", rating: 4.6, feedbackCount: 73, coursesCompleted: 7, coursesTotal: 7, badges: ["Culinary Excellence", "Team Player"], joinDate: "May 2022", currentCourse: null },
  { id: 8, name: "Anna Petrov", role: "Guest Relations Manager", department: "Guest Services", avatar: null, status: "graduated", rating: 4.9, feedbackCount: 201, coursesCompleted: 12, coursesTotal: 12, badges: ["Leadership Pro", "Customer Service Star", "Mentor", "5-Star Service"], joinDate: "Feb 2020", currentCourse: null },
]

const courses = [
  { id: 1, title: "Customer Service Excellence", description: "Master the art of exceptional guest service", duration: "4 hours", enrolled: 24, completed: 18, category: "Core", modules: ["Introduction to Guest Psychology", "Communication Skills", "Handling Complaints", "Building Rapport", "Service Recovery"], instructor: "Anna Petrov", lastUpdated: "Jan 2024" },
  { id: 2, title: "Advanced Guest Relations", description: "Handle complex guest situations with confidence", duration: "6 hours", enrolled: 12, completed: 8, category: "Advanced", modules: ["VIP Guest Management", "Crisis Communication", "Cultural Sensitivity", "Emotional Intelligence", "Conflict Resolution", "Upselling Techniques"], instructor: "David Thompson", lastUpdated: "Feb 2024" },
  { id: 3, title: "Food Safety Fundamentals", description: "Essential food handling and safety protocols", duration: "3 hours", enrolled: 15, completed: 10, category: "Required", modules: ["Food Storage Guidelines", "Temperature Control", "Allergen Awareness", "Hygiene Standards"], instructor: "Robert Kim", lastUpdated: "Dec 2023" },
  { id: 4, title: "Leadership in Hospitality", description: "Develop leadership skills for hotel management", duration: "8 hours", enrolled: 8, completed: 5, category: "Leadership", modules: ["Team Building", "Performance Management", "Strategic Planning", "Decision Making", "Coaching & Mentoring", "Budget Management", "Change Management"], instructor: "David Thompson", lastUpdated: "Mar 2024" },
  { id: 5, title: "Wellness & Hospitality", description: "Understanding wellness trends in modern hotels", duration: "4 hours", enrolled: 10, completed: 3, category: "Specialty", modules: ["Modern Wellness Trends", "Spa Services Overview", "Guest Wellness Programs", "Mindfulness in Service"], instructor: "Lisa Wong", lastUpdated: "Jan 2024" },
]

export default function StaffManagementTab() {
  const [staffFilter, setStaffFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statsDialog, setStatsDialog] = useState<StaffStatsType>(null)
  const [courseDialog, setCourseDialog] = useState<typeof courses[0] | null>(null)

  const filteredStaff = staffMembers.filter(staff => {
    const matchesStatus = staffFilter === "all" || staff.status === staffFilter
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDept = departmentFilter === "all" || staff.department === departmentFilter
    return matchesStatus && matchesSearch && matchesDept
  })

  const stats = {
    total: staffMembers.length,
    graduated: staffMembers.filter(s => s.status === "graduated").length,
    learning: staffMembers.filter(s => s.status === "learning").length,
    avgRating: (staffMembers.reduce((acc, s) => acc + s.rating, 0) / staffMembers.length).toFixed(1),
  }

  const departments = [...new Set(staffMembers.map(s => s.department))]
  const topPerformers = [...staffMembers].sort((a, b) => b.rating - a.rating).slice(0, 3)

  const getStatsDialogContent = () => {
    switch (statsDialog) {
      case "total":
        return { title: "All Staff Members", items: staffMembers }
      case "graduated":
        return { title: "Graduated Staff", items: staffMembers.filter(s => s.status === "graduated") }
      case "learning":
        return { title: "Staff In Training", items: staffMembers.filter(s => s.status === "learning") }
      case "avgRating":
        const ratingGroups = [
          { range: "4.8 - 5.0", count: staffMembers.filter(s => s.rating >= 4.8).length },
          { range: "4.5 - 4.7", count: staffMembers.filter(s => s.rating >= 4.5 && s.rating < 4.8).length },
          { range: "4.0 - 4.4", count: staffMembers.filter(s => s.rating >= 4.0 && s.rating < 4.5).length },
          { range: "Below 4.0", count: staffMembers.filter(s => s.rating < 4.0).length },
        ]
        return { title: "Rating Distribution", ratingGroups }
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-bold text-foreground">
          Staff Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Track performance, training progress, and team development
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all" onClick={() => setStatsDialog("total")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all" onClick={() => setStatsDialog("graduated")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.graduated}</p>
                <p className="text-xs text-muted-foreground">Graduated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all" onClick={() => setStatsDialog("learning")}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.learning}</p>
                <p className="text-xs text-muted-foreground">In Training</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all" onClick={() => setStatsDialog("avgRating")}>
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
                {getStatsDialogContent()?.ratingGroups?.map((group: { range: string; count: number }) => (
                  <div key={group.range} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24">{group.range}</span>
                    <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-amber-400 transition-all" style={{ width: `${(group.count / stats.total) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{group.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              getStatsDialogContent()?.items?.map((staff: typeof staffMembers[0]) => (
                <div key={staff.id} className="p-3 rounded-lg border border-border flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {staff.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{staff.name}</span>
                      <Badge variant="secondary" className={staff.status === "graduated" ? "bg-green-100 text-green-800" : ""}>
                        {staff.status === "graduated" ? "Graduated" : "Learning"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{staff.role} - {staff.department}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-medium">{staff.rating}</span>
                      {staff.currentCourse && (
                        <span className="text-xs text-muted-foreground">| Currently: {staff.currentCourse}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Performers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Trophy className="h-5 w-5 text-amber-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((staff, index) => (
              <div key={staff.id} className={`flex items-center gap-3 p-4 rounded-lg border ${index === 0 ? "bg-amber-50 border-amber-200" : "bg-secondary/30"}`}>
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={staff.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {staff.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{staff.rating}</span>
                    <span className="text-xs text-muted-foreground">({staff.feedbackCount} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Directory</TabsTrigger>
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={staffFilter} onValueChange={setStaffFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
                <SelectItem value="learning">In Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => (
              <Card key={staff.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={staff.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                          {staff.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{staff.name}</h3>
                            <p className="text-sm text-muted-foreground">{staff.role}</p>
                          </div>
                          <Badge variant={staff.status === "graduated" ? "default" : "secondary"} className={staff.status === "graduated" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                            {staff.status === "graduated" ? (
                              <><GraduationCap className="h-3 w-3 mr-1" />Graduated</>
                            ) : (
                              <><BookOpen className="h-3 w-3 mr-1" />Learning</>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">{staff.rating}</span>
                          </div>
                          <span className="text-muted-foreground">|</span>
                          <span className="text-muted-foreground">{staff.department}</span>
                        </div>
                      </div>
                    </div>
                    {staff.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {staff.badges.map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs bg-secondary/50">
                            <Award className="h-3 w-3 mr-1" />{badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-muted-foreground">Training Progress</span>
                        <span className="font-medium">{staff.coursesCompleted}/{staff.coursesTotal}</span>
                      </div>
                      <Progress value={(staff.coursesCompleted / staff.coursesTotal) * 100} className="h-2" />
                      {staff.currentCourse && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Currently: <span className="font-medium text-foreground">{staff.currentCourse}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-secondary/30 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground"><Clock className="h-3.5 w-3.5 inline mr-1" />Joined {staff.joinDate}</span>
                    <span className="text-muted-foreground">{staff.feedbackCount} reviews</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all" onClick={() => setCourseDialog(course)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{course.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{course.duration}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mt-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{Math.round((course.completed / course.enrolled) * 100)}%</span>
                    </div>
                    <Progress value={(course.completed / course.enrolled) * 100} className="h-2" />
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{course.enrolled} enrolled</span>
                      <span>{course.completed} completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Course Dialog */}
      <Dialog open={courseDialog !== null} onOpenChange={(open) => !open && setCourseDialog(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {courseDialog && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{courseDialog.category}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />{courseDialog.duration}
                  </span>
                </div>
                <DialogTitle className="font-serif">{courseDialog.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">{courseDialog.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-2xl font-bold text-foreground">{courseDialog.enrolled}</p>
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <p className="text-2xl font-bold text-green-700">{courseDialog.completed}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{Math.round((courseDialog.completed / courseDialog.enrolled) * 100)}%</span>
                  </div>
                  <Progress value={(courseDialog.completed / courseDialog.enrolled) * 100} className="h-2" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium">{courseDialog.instructor}</span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course Modules</h4>
                  <div className="space-y-2">
                    {courseDialog.modules.map((module, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </div>
                        <span className="text-sm">{module}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
