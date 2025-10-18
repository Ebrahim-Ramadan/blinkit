"use client"

import { useState, useEffect } from "react"
import { Trash2, MessageCircle, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface Recommendation {
  id: string
  userName: string
  email: string
  productName: string
  message: string
  rating: number
  date: string
  status: "new" | "reviewed" | "implemented"
  priority: "low" | "medium" | "high"
  category: string
  potentialRevenue?: number
}

// No initial recommendations, fetch from API

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive"
    case "medium":
      return "bg-accent/10 text-accent"
    case "low":
      return "bg-primary/10 text-primary"
    default:
      return "bg-muted/10 text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "new":
      return <AlertCircle className="w-4 h-4" />
    case "reviewed":
      return <Clock className="w-4 h-4" />
    case "implemented":
      return <CheckCircle className="w-4 h-4" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-primary/10 text-primary"
    case "reviewed":
      return "bg-accent/10 text-accent"
    case "implemented":
      return "bg-primary/10 text-primary"
    default:
      return "bg-muted/10 text-muted-foreground"
  }
}
export function RecommendationsView(): JSX.Element {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  // Fetch recommendations from API
  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true)
      const res = await fetch('/api/recommendations')
      const data = await res.json()
      setRecommendations(
        data.map((r: any) => ({
          id: r._id || r.id,
          userName: r.user_name ?? r.userName,
          email: r.email,
          productName: r.product_suggestion ?? r.productName,
          message: r.message,
          rating: r.rating ?? 5,
          date: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : r.date,
          status: r.status ?? "new",
          priority: r.priority ?? "medium",
          category: r.category ?? "Other",
          potentialRevenue: r.potentialRevenue ?? 0,
        }))
      )
      setLoading(false)
    }
    fetchRecommendations()
  }, [])
  const [filter, setFilter] = useState<"all" | "new" | "reviewed" | "implemented">("all")
  const [sortBy, setSortBy] = useState<"priority" | "revenue" | "rating" | "date">("priority")

  const filteredRecommendations = recommendations.filter((r) => filter === "all" || r.status === filter)

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        )
      case "revenue":
        return (b.potentialRevenue || 0) - (a.potentialRevenue || 0)
      case "rating":
        return b.rating - a.rating
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      default:
        return 0
    }
  })

  const handleStatusChange = async (id: string, status: Recommendation["status"]) => {
    // Optionally, update status in backend if supported
    setRecommendations(recommendations.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/recommendations/${id}`, { method: 'DELETE' })
    setRecommendations(recommendations.filter((r) => r.id !== id))
  }

  const stats = {
    total: recommendations.length,
    new: recommendations.filter((r) => r.status === "new").length,
    reviewed: recommendations.filter((r) => r.status === "reviewed").length,
    implemented: recommendations.filter((r) => r.status === "implemented").length,
    totalPotentialRevenue: recommendations.reduce((sum, r) => sum + (r.potentialRevenue || 0), 0),
    highPriority: recommendations.filter((r) => r.priority === "high").length,
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><span>Loading recommendations...</span></div>
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Recommendations</h1>
        <p className="text-muted-foreground mt-1">Feedback from your customers and AI-powered insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">New</p>
              <p className="text-2xl font-bold text-primary mt-2">{stats.new}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">High Priority</p>
              <p className="text-2xl font-bold text-destructive mt-2">{stats.highPriority}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Potential Revenue</p>
              <p className="text-2xl font-bold text-accent mt-2">EGP {stats.totalPotentialRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "new", "reviewed", "implemented"] as const).map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? "default" : "outline"}
              className={filter === status ? "bg-primary text-primary-foreground" : "border-border"}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground self-center">Sort by:</span>
          {(["priority", "revenue", "rating", "date"] as const).map((sort) => (
            <Button
              key={sort}
              onClick={() => setSortBy(sort)}
              variant={sortBy === sort ? "default" : "outline"}
              size="sm"
              className={sortBy === sort ? "bg-primary text-primary-foreground" : "border-border"}
            >
              {sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {sortedRecommendations.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No recommendations found</p>
            </CardContent>
          </Card>
        ) : (
          sortedRecommendations.map((rec) => (
            <Card key={rec.id} className="hover:shadow-md transition-shadow border-border">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{rec.userName}</h3>
                        <div className="flex gap-1">
                          {[...Array(rec.rating)].map((_, i) => (
                            <span key={i} className="text-accent">
                              ★
                            </span>
                          ))}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}
                        >
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.email}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <select
                        value={rec.status}
                        onChange={(e) => handleStatusChange(rec.id, e.target.value as Recommendation["status"])}
                        className="px-3 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="implemented">Implemented</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rec.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product & Message */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium text-primary">Suggested Product: {rec.productName}</p>
                      <span className="text-xs bg-muted px-2 py-1 rounded">{rec.category}</span>
                    </div>
                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">{rec.message}</p>
                  </div>

                  {/* Insights */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-accent/5 p-3 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Potential Revenue</p>
                        <p className="text-sm font-semibold text-accent">
                          EGP {rec.potentialRevenue?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-lg">
                      {getStatusIcon(rec.status)}
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-sm font-semibold text-primary">
                          {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(rec.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
