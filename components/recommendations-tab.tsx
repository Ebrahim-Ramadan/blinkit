"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Star } from "lucide-react"
import { useApi } from "@/hooks/use-api"
import type { Recommendation } from "@/lib/types"

export default function RecommendationsTab() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    message: "",
    rating: 5,
  })

  const { request: fetchRecommendations } = useApi<Recommendation[]>()
  const { request: deleteRecommendation } = useApi()

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      const data = await fetchRecommendations("/api/recommendations")
      setRecommendations(data || [])
    } catch (error) {
      console.error("[v0] Error loading recommendations:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmitRecommendation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.userName || !formData.email || !formData.message) {
      alert("Please fill in all fields")
      return
    }

    try {
      await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      await loadRecommendations()
      setFormData({ userName: "", email: "", message: "", rating: 5 })
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Error submitting recommendation:", error)
    }
  }

  const handleDeleteRecommendation = async (id: string | undefined) => {
    if (!id) return
    try {
      await deleteRecommendation(`/api/recommendations/${id}`, "DELETE")
      await loadRecommendations()
    } catch (error) {
      console.error("[v0] Error deleting recommendation:", error)
    }
  }

  const toggleStatus = async (id: string | undefined, currentStatus: string) => {
    if (!id) return
    const newStatus = currentStatus === "new" ? "reviewed" : currentStatus === "reviewed" ? "archived" : "new"
    try {
      await fetch(`/api/recommendations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      await loadRecommendations()
    } catch (error) {
      console.error("[v0] Error updating recommendation:", error)
    }
  }

  const newCount = recommendations.filter((r) => r.status === "new").length
  const reviewedCount = recommendations.filter((r) => r.status === "reviewed").length

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in slide-in-from-top duration-500">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Recommendations</h2>
          <p className="text-sm text-muted-foreground">
            {newCount} new • {reviewedCount} reviewed
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2 w-full sm:w-auto hover:scale-105 transition-transform duration-200"
        >
          <Plus size={18} />
          Add Feedback
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 bg-card animate-in fade-in slide-in-from-top duration-300">
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>Share your recommendations or feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRecommendation} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name *</label>
                  <Input
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-in fade-in duration-500" style={{ animationDelay: "50ms" }}>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      className="focus:outline-none hover:scale-125 transition-transform duration-200"
                    >
                      <Star
                        size={24}
                        className={star <= formData.rating ? "fill-accent text-accent" : "text-muted-foreground"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 animate-in fade-in duration-500" style={{ animationDelay: "100ms" }}>
                <label className="text-sm font-medium">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share your feedback or recommendations..."
                  rows={4}
                  required
                  className="transition-all duration-200"
                />
              </div>

              <div className="flex gap-2 animate-in fade-in duration-500" style={{ animationDelay: "150ms" }}>
                <Button type="submit" className="flex-1 hover:scale-105 transition-transform duration-200">
                  Submit Feedback
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 hover:scale-105 transition-transform duration-200"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <Card className="text-center py-12 animate-in fade-in duration-500">
            <CardContent>
              <p className="text-muted-foreground">No recommendations yet. Add your first feedback!</p>
            </CardContent>
          </Card>
        ) : (
          recommendations.map((rec, index) => (
            <Card
              key={rec._id?.toString()}
              className={`${rec.status === "new" ? "border-primary/50 bg-primary/5" : ""} hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{rec.userName}</CardTitle>
                      <div className="flex gap-0.5">
                        {[...Array(rec.rating)].map((_, i) => (
                          <Star key={i} size={14} className="fill-accent text-accent" />
                        ))}
                      </div>
                      {rec.status === "new" && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded animate-in pulse duration-2000">
                          New
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-xs mt-1">
                      {rec.email} • {rec.createdAt?.toString().split("T")[0]}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(rec._id?.toString(), rec.status)}
                      className="text-xs hover:bg-primary/10 transition-colors duration-200"
                    >
                      {rec.status === "new" ? "Mark Reviewed" : rec.status === "reviewed" ? "Archive" : "Restore"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecommendation(rec._id?.toString())}
                      className="hover:bg-destructive/10 transition-colors duration-200"
                    >
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{rec.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
