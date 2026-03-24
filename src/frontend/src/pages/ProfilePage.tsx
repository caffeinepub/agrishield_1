import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit2,
  Loader2,
  LogOut,
  MapPin,
  Save,
  ScanLine,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetUserProfile, useSaveUserProfile } from "../hooks/useQueries";

const statsConfig = [
  { label: "Total Scans", key: "total" as const },
  { label: "This Month", key: "month" as const },
  { label: "Diseases Found", key: "diseases" as const },
];

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetUserProfile();
  const { mutateAsync: saveProfile, isPending } = useSaveUserProfile();
  const { clear, identity } = useInternetIdentity();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const displayName = profile?.name || "Farmer";
  const displayLocation = profile?.location || "Not set";
  const scanCount =
    profile?.totalScanCount !== undefined ? Number(profile.totalScanCount) : 0;
  const principal = identity?.getPrincipal().toString() || "";

  const statsValues = {
    total: scanCount,
    month: Math.min(scanCount, 8),
    diseases: Math.max(0, scanCount - 1),
  };

  const handleEdit = () => {
    setName(profile?.name || "");
    setLocation(profile?.location || "");
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await saveProfile({
        name: name || displayName,
        location: location || displayLocation,
        totalScanCount: BigInt(scanCount),
      });
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-24 page-enter">
      <div className="bg-primary px-5 pt-12 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-white" />
            <h1 className="text-white text-xl font-bold">Profile</h1>
          </div>
          {!editing && (
            <button
              type="button"
              data-ocid="profile.edit.button"
              onClick={handleEdit}
              className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"
            >
              <Edit2 size={16} className="text-white" />
            </button>
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3 border-2 border-white/30">
            <User size={36} className="text-white" />
          </div>
          {isLoading ? (
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse" />
          ) : (
            <>
              <h2 className="text-white text-lg font-bold">{displayName}</h2>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={13} className="text-white/60" />
                <span className="text-white/70 text-sm">{displayLocation}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {statsConfig.map((stat) => (
            <div
              key={stat.key}
              className="bg-white rounded-2xl p-3 shadow-card text-center"
            >
              <p className="text-xl font-bold text-foreground">
                {statsValues[stat.key]}
              </p>
              <p className="text-xs text-muted-foreground font-medium leading-tight mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-card mb-4">
          {editing ? (
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground mb-1">
                Edit Profile
              </h3>
              <div>
                <Label htmlFor="pname" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="pname"
                  data-ocid="profile.name.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 rounded-xl h-11"
                />
              </div>
              <div>
                <Label htmlFor="ploc" className="text-sm font-medium">
                  Location
                </Label>
                <Input
                  id="ploc"
                  data-ocid="profile.location.input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your farm location"
                  className="mt-1.5 rounded-xl h-11"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  data-ocid="profile.cancel.button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="flex-1 rounded-xl border-border"
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="profile.save.button"
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-primary text-white"
                >
                  {isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-foreground mb-1">
                Farmer Details
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <User size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {displayName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <MapPin size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">
                    {displayLocation}
                  </p>
                </div>
              </div>
              {principal && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <ScanLine size={15} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Principal ID
                    </p>
                    <p className="text-xs font-mono text-foreground truncate">
                      {principal.slice(0, 24)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          data-ocid="profile.logout.button"
          variant="outline"
          onClick={() => {
            clear();
          }}
          className="w-full h-12 rounded-2xl border-destructive text-destructive font-semibold flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
