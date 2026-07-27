import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dices } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rawNext = params.get("next") ?? "";
  const nextPath = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${nextPath || "/admin"}`,
        },
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Account created! Please contact the super admin to grant you access.");
      setIsSignUp(false);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Authentication failed");
      setLoading(false);
      return;
    }

    if (nextPath) {
      window.location.href = nextPath;
      return;
    }

    const { data: roles } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!roles) {
      toast.error("You do not have admin access");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    toast.success("Welcome, Admin!");
    navigate("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Dices className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold">{isSignUp ? "Admin Sign Up" : "Admin Login"}</h1>
          <p className="text-muted-foreground text-sm mt-2">CRM Dashboard Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50 h-12"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background/50 h-12"
            required
          />
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
        <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => navigate("/")}>
          ← Back to Website
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;
