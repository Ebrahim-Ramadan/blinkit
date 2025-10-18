"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Phone, Mail, MapPin } from "lucide-react"
import SupplierForm from "./supplier-form"
import { useApi } from "@/hooks/use-api"
import type { Supplier } from "@/lib/types"

export default function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  const { request: fetchSuppliers } = useApi<Supplier[]>()
  const { request: deleteSupplier } = useApi()

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers("/api/suppliers")
      setSuppliers(data || [])
    } catch (error) {
      console.error("[v0] Error loading suppliers:", error)
    }
  }

  const handleSaveSupplier = async (supplier: Supplier) => {
    try {
      if (editingSupplier?._id) {
        await fetch(`/api/suppliers/${editingSupplier._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplier),
        })
      } else {
        await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplier),
        })
      }
      await loadSuppliers()
      setShowForm(false)
      setEditingSupplier(null)
    } catch (error) {
      console.error("[v0] Error saving supplier:", error)
    }
  }

  const handleDeleteSupplier = async (id: string | undefined) => {
    if (!id) return
    try {
      await deleteSupplier(`/api/suppliers/${id}`, "DELETE")
      await loadSuppliers()
    } catch (error) {
      console.error("[v0] Error deleting supplier:", error)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in slide-in-from-top duration-500">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Suppliers</h2>
          <p className="text-sm text-muted-foreground">Manage your supplier network</p>
        </div>
        <Button
          onClick={() => {
            setEditingSupplier(null)
            setShowForm(true)
          }}
          className="gap-2 w-full sm:w-auto hover:scale-105 transition-transform duration-200"
        >
          <Plus size={18} />
          Add Supplier
        </Button>
      </div>

      {showForm && (
        <div className="animate-in fade-in slide-in-from-top duration-300">
          <SupplierForm
            supplier={editingSupplier}
            onSave={handleSaveSupplier}
            onCancel={() => {
              setShowForm(false)
              setEditingSupplier(null)
            }}
          />
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier, index) => (
          <Card
            key={supplier._id?.toString()}
            className="flex flex-col hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{supplier.name}</CardTitle>
                  <CardDescription className="text-xs">{supplier.address}</CardDescription>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingSupplier(supplier)
                      setShowForm(true)
                    }}
                    className="hover:bg-primary/10 transition-colors duration-200"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSupplier(supplier._id?.toString())}
                    className="hover:bg-destructive/10 transition-colors duration-200"
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                  <Mail size={16} />
                  <a href={`mailto:${supplier.email}`} className="truncate">
                    {supplier.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                  <Phone size={16} />
                  <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="break-words">{supplier.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <Card className="text-center py-12 animate-in fade-in duration-500">
          <CardContent>
            <p className="text-muted-foreground">No suppliers yet. Add your first supplier to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
