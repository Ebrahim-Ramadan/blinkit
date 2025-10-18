"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, MessageCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Recommendation {
  _id: string
  user_name: string
  product_suggestion: string
  message: string
  created_at: string
}

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    user_name: "",
    product_suggestion: "",
    message: "",
  })

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/recommendations")
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error("[v0] Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        await fetchRecommendations()
        setFormData({
          user_name: "",
          product_suggestion: "",
          message: "",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("[v0] Error submitting recommendation:", error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, { method: "DELETE" })
      if (response.ok) {
        await fetchRecommendations()
      }
    } catch (error) {
      console.error("[v0] Error deleting recommendation:", error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setFormData({
      user_name: "",
      product_suggestion: "",
      message: "",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Add Recommendation Button */}
      <motion.div className="flex justify-end" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Recommendation
          </Button>
        </motion.div>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Add User Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">User Name *</label>
                    <Input
                      required
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                      placeholder="e.g., Ahmed Hassan"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Product Suggestion *</label>
                    <Input
                      required
                      value={formData.product_suggestion}
                      onChange={(e) => setFormData({ ...formData, product_suggestion: e.target.value })}
                      placeholder="e.g., Organic Milk"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="User feedback or details..."
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Add Recommendation
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recommendations List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants}>
          {recommendations.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No recommendations yet</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <AnimatePresence>
              {recommendations.map((rec) => (
                <motion.div key={rec._id} variants={cardVariants} initial="hidden" animate="visible" exit="exit">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{rec.product_suggestion}</h3>
                            <motion.span
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                              whileHover={{ scale: 1.05 }}
                            >
                              Suggested
                            </motion.span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            <span className="font-medium">From:</span> {rec.user_name}
                          </p>
                          {rec.message && <p className="text-sm bg-muted/50 p-3 rounded-lg italic">"{rec.message}"</p>}
                          <p className="text-xs text-muted-foreground mt-3">
                            {new Date(rec.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleDelete(rec._id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
