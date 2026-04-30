import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/settings/theme-toggle";
import { SignOutButton } from "@/components/settings/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <AppShell>
      <div className="space-y-4 max-w-xl">
        <h1 className="text-xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Choose your preferred theme
            </p>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium">{user?.email ?? "Unknown"}</p>
            </div>
            <SignOutButton />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
