import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Settings = () => {
  const { profile, loading } = useAuth();
  if (loading) return null;
  const isSenior = (profile?.role ?? "").toLowerCase().includes("senior");
  if (!isSenior) return <Navigate to="/dashboard" replace />;
  return (
  <DashboardLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-sm text-muted-foreground mt-1">Lab and dashboard preferences</p>
    </div>
    <div className="grid lg:grid-cols-2 gap-4 max-w-4xl">
      <Card className="border-border/60 shadow-soft">
        <CardHeader><CardTitle className="text-base">Laboratory Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Lab Name</Label><Input defaultValue="Medvic Goodhealth Medical Laboratory" /></div>
          <div><Label>Address</Label><Input defaultValue="Plot 1, Road 4 Udo Layout, Rumuopkarali Ext., PHC" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Primary Phone</Label><Input defaultValue="+234 813 558 1946" /></div>
            <div><Label>Secondary</Label><Input defaultValue="+234 153 359 3469" /></div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/60 shadow-soft">
        <CardHeader><CardTitle className="text-base">Result Entry Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Auto-save drafts</p><p className="text-xs text-muted-foreground">Save every 5 seconds while typing</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Highlight out-of-range values</p><p className="text-xs text-muted-foreground">Show colored badges on abnormal results</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Require double confirmation</p><p className="text-xs text-muted-foreground">Confirm before marking Completed</p></div>
            <Switch defaultChecked />
          </div>
          <Button variant="hero" className="w-full">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
  );
};

export default Settings;
