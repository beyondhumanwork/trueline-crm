"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createSessionAction } from "@/actions/sessions";

interface SessionFormProps {
  clients: Array<{ id: string; first_name: string; last_name: string }>;
}

export function SessionForm({ clients }: SessionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createSessionAction(new FormData(e.currentTarget));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">{error}</div>
      )}

      <div>
        <Label>Client</Label>
        <Select name="client_id" required>
          <SelectTrigger><SelectValue placeholder="Select client..." /></SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.first_name} {c.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Session Type</Label>
        <Select name="session_type" required>
          <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private Session</SelectItem>
            <SelectItem value="cornering_clinic">Cornering Clinic</SelectItem>
            <SelectItem value="platinum_ride">Platinum Ride</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Date &amp; Time</Label>
          <Input name="scheduled_start" type="datetime-local" required />
        </div>
        <div>
          <Label>Duration (min)</Label>
          <Select name="duration_minutes" defaultValue="60">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 min</SelectItem>
              <SelectItem value="60">60 min</SelectItem>
              <SelectItem value="90">90 min</SelectItem>
              <SelectItem value="120">120 min</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Location</Label>
        <Input name="location" placeholder="e.g. Vaughan Mills Lot" />
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea name="notes" rows={2} />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Scheduling..." : "Schedule Session"}
      </Button>
    </form>
  );
}
