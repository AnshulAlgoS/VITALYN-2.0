import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { API_BASE } from "@/hooks/useApiQuery";
import gsap from "gsap";

type Role = "patient" | "doctor";
type LoginStep = "credentials" | "otp";

export default function Login() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState<LoginStep>("credentials");
  const [role, setRole] = useState<Role>("patient");
  const [email, setEmail] = useState("patient123@gmail.com");
  const [password, setPassword] = useState("patient123");
  const [phone, setPhone] = useState("+1");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pageRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.15 }
      );

      if (toggleRef.current) {
        gsap.fromTo(
          toggleRef.current,
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 }
        );
      }
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    if (nextRole === "patient") {
      setEmail("patient123@gmail.com");
      setPassword("patient123");
    } else {
      setEmail("doctor123@gmail.com");
      setPassword("doctor123");
    }
    setError(null);
  };

  const handleSendOtp = async () => {
    if (!phone || !phone.startsWith("+") || phone.length < 10) {
      setError("Please enter a valid phone number in E.164 format (e.g., +1234567890)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phone,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setOtpSent(true);
      setStep("otp");
    } catch (err) {
      setError("Network error while contacting Vitalyn API");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phone,
          otp,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid OTP");
        setLoading(false);
        return;
      }

      const user = {
        email: data.email,
        phone: phone !== "+1" ? phone : undefined,
        role: data.role as Role,
        displayName: phone !== "+1" ? phone : data.email.split("@")[0],
      };

      try {
        window.localStorage.setItem("vitalynUser", JSON.stringify(user));
      } catch {
        // localStorage unavailable
      }

      if (user.role === "patient") {
        navigate("/patient");
      } else {
        navigate("/opd-queue");
      }
    } catch (err) {
      setError("Network error while contacting Vitalyn API");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Unable to log in");
        setLoading(false);
        return;
      }

      const user = {
        email: data.email,
        role: data.role as Role,
        displayName: email,
      };

      try {
        window.localStorage.setItem("vitalynUser", JSON.stringify(user));
      } catch {
        // localStorage unavailable
      }

      if (user.role === "patient") {
        navigate("/patient");
      } else {
        navigate("/opd-queue");
      }
    } catch (err) {
      setError("Network error while contacting Vitalyn API");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("credentials");
    setOtpSent(false);
    setOtp("");
    setError(null);
  };

  return (
    <div
      ref={pageRef}
      className="relative z-10 min-h-screen flex flex-col bg-[#fdfbf6] text-[#111322]"
    >
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <Card
          ref={cardRef}
          className="w-full max-w-md bg-[#ffffff] border-[#e1d8c7] shadow-xl sm:rounded-3xl"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#111322]">Sign in to Vitalyn</CardTitle>
            <CardDescription className="text-[#4b4f70]">
              {step === "credentials"
                ? "Use the demo accounts to experience the patient and doctor journeys."
                : "Enter the verification code sent to your WhatsApp."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={toggleRef}
              className="mb-6 flex rounded-full bg-[#f1ede2] p-1"
            >
              <button
                type="button"
                onClick={() => handleRoleChange("patient")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  role === "patient"
                    ? "bg-[#3a3e61] text-[#f1ede2]"
                    : "text-[#3a3e61]/80 hover:text-[#111322]"
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange("doctor")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  role === "doctor"
                    ? "bg-[#3a3e61] text-[#f1ede2]"
                    : "text-[#3a3e61]/80 hover:text-[#111322]"
                }`}
              >
                Doctor
              </button>
            </div>

            {step === "credentials" ? (
              <div className="space-y-4">
                <div className="mb-4 p-3 rounded-lg bg-[#f1ede2] border border-[#e1d8c7]">
                  <p className="text-sm font-medium text-[#3a3e61] mb-2">WhatsApp OTP Login</p>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#111322]">Phone Number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="bg-[#fdfbf6] border-[#e1d8c7] text-[#111322] placeholder:text-[#9a9fb3]"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="mt-3 w-full bg-[#3a3e61] hover:bg-[#2a2e51] text-[#f1ede2]"
                  >
                    {loading ? "Sending..." : "Send OTP via WhatsApp"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#e1d8c7]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#ffffff] px-2 text-[#4b4f70]">Or continue with</span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleCredentialsLogin}>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#111322]">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#fdfbf6] border-[#e1d8c7] text-[#111322] placeholder:text-[#9a9fb3]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[#111322]">Password</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#fdfbf6] border-[#e1d8c7] text-[#111322] placeholder:text-[#9a9fb3]"
                    />
                  </div>
                  {error && (
                    <div className="rounded-md border border-rose-300/60 bg-rose-500/15 px-3 py-2 text-sm text-rose-700">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-[#111322] hover:bg-[#1f2238] text-[#fdfbf6] font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                  <p className="mt-2 text-xs text-[#4b4f70]">
                    Demo credentials: patient123@gmail.com / patient123 or doctor123@gmail.com / doctor123
                  </p>
                </form>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#111322]">Verification Code</label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="bg-[#fdfbf6] border-[#e1d8c7] text-[#111322] placeholder:text-[#9a9fb3] text-center text-lg tracking-widest"
                  />
                </div>
                {error && (
                  <div className="rounded-md border border-rose-300/60 bg-rose-500/15 px-3 py-2 text-sm text-rose-700">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#111322] hover:bg-[#1f2238] text-[#fdfbf6] font-semibold"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 border-[#e1d8c7] text-[#3a3e61]"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 border-[#e1d8c7] text-[#3a3e61]"
                  >
                    Resend OTP
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}