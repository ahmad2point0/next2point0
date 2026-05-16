"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Switch } from "@/global/components/ui/switch";
import { Label } from "@/global/components/ui/label";
import { Separator } from "@/global/components/ui/separator";
import { Button } from "@/global/components/ui/button";

interface Pref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL: Pref[] = [
  {
    id: "email-product",
    label: "Product updates",
    description: "Get notified when we ship new features.",
    enabled: true,
  },
  {
    id: "email-billing",
    label: "Billing emails",
    description: "Receipts, renewals, and payment failures.",
    enabled: true,
  },
  {
    id: "weekly-digest",
    label: "Weekly digest",
    description: "A summary of what your team shipped each Friday.",
    enabled: false,
  },
];

export function SettingsForm() {
  const [prefs, setPrefs] = useState<Pref[]>(INITIAL);

  const toggle = (id: string) => {
    setPrefs((current) => current.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to hear about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prefs.map((pref, index) => (
            <div key={pref.id}>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor={pref.id}>{pref.label}</Label>
                  <p className="text-muted-foreground text-sm">{pref.description}</p>
                </div>
                <Switch
                  id={pref.id}
                  checked={pref.enabled}
                  onCheckedChange={() => toggle(pref.id)}
                />
              </div>
              {index < prefs.length - 1 ? <Separator className="mt-4" /> : null}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>These actions are not reversible.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => toast.error("This is a demo. Account deletion is disabled.")}
          >
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
