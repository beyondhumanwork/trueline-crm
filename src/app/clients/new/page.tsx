import { AppShell } from "@/components/layout/app-shell";
import { ClientForm } from "@/components/clients/client-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewClientPage() {
  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="text-xl font-bold mb-4">New Client</h1>
        <Card>
          <CardHeader><CardTitle className="text-sm font-semibold">Client Details</CardTitle></CardHeader>
          <CardContent>
            <ClientForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
