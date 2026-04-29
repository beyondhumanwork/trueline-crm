"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClientAction, updateClientAction } from "@/actions/clients";

interface ClientFormProps {
  mode: "create" | "edit";
  clientId?: string;
  initialData?: {
    first_name: string;
    last_name: string;
    email?: string | null;
    phone: string;
    experience_level: string;
    license_type?: string | null;
    notes?: string | null;
    status?: string;
  };
}

export function ClientForm({ mode, clientId, initialData }: ClientFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (mode === "create") {
        await createClientAction(formData);
      } else if (clientId) {
        await updateClientAction(clientId, formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save client");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" required defaultValue={initialData?.first_name} />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" required defaultValue={initialData?.last_name} />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={initialData?.email ?? ""} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" required defaultValue={initialData?.phone} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Experience Level</Label>
          <Select name="experience_level" defaultValue={initialData?.experience_level ?? "beginner"}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>License Type</Label>
          <Select name="license_type" defaultValue={initialData?.license_type ?? ""}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="learner">Learner</SelectItem>
              <SelectItem value="provisional">Provisional</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea name="notes" defaultValue={initialData?.notes ?? ""} rows={3} />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : mode === "create" ? "Add Client" : "Save Changes"}
      </Button>
    </form>
  );
}
