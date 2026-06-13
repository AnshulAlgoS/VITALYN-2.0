import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Activity, FileText, User, HeartPulse, Stethoscope, ShieldCheck, Users } from "lucide-react";

// Mock data for health profile
const mockHealthProfile = {
  patientId: "P001",
  name: "Alex Johnson",
  age: 35,
  bloodType: "O+",
  allergies: ["Penicillin", "Peanuts"],
  medications: [
    { name: "Apixaban", dose: "2.5 mg", frequency: "Twice daily" },
    { name: "Acetaminophen (Tylenol)", dose: "500 mg", frequency: "As needed" },
    { name: "Pantoprazole (Protonix)", dose: "40 mg", frequency: "Once daily" },
  ],
  medicalHistory: ["Laparoscopic appendectomy", "Type 2 Diabetes", "CKD Stage 3"],
  emergencyContacts: [
    { name: "Sarah Johnson", relationship: "Spouse", phone: "+1-555-123-4567" },
    { name: "Dr. Michael Chen", relationship: "Primary Care Physician", phone: "+1-555-987-6543" },
  ],
  insurance: { provider: "HealthPlus", policyNumber: "HP-2025-789012" },
  latestVitals: {
    heartRate: "72 bpm",
    bloodPressure: "120/80 mmHg",
    spo2: "98%",
    temperature: "98.6°F (37.0°C)",
    lastUpdated: "June 13, 2026 • 2:30 PM",
  },
};

export default function HealthProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbf6] to-[#f1ede2] font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#111322]">
            Vitalyn Health Profile
          </h1>
          <p className="text-lg text-[#4b4f70] mt-2">
            Patient {mockHealthProfile.patientId} - {mockHealthProfile.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Info */}
          <Card className="border-[2px] border-[#111322] rounded-[32px] shadow-[8px_8px_0_0_#111322] bg-[#fdfbf6]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#fee2e2] border-[2px] border-[#111322] shadow-[4px_4px_0_0_#111322] flex items-center justify-center">
                  <User className="h-8 w-8 text-[#f97373]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-[#111322]">
                    {mockHealthProfile.name}
                  </CardTitle>
                  <p className="text-sm text-[#4b4f70]">
                    Age {mockHealthProfile.age} • Blood Type {mockHealthProfile.bloodType} • ID: {mockHealthProfile.patientId}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#3a3e61] mb-2">
                  Allergies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockHealthProfile.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-xs font-semibold"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Vitals */}
          <Card className="border-[2px] border-[#111322] rounded-[32px] shadow-[8px_8px_0_0_#111322] bg-[#fdfbf6]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f1ede2] border-[2px] border-[#111322] shadow-[3px_3px_0_0_#111322] flex items-center justify-center">
                  <HeartPulse className="h-6 w-6 text-[#3a3e61]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-[#111322]">
                    Latest Vitals
                  </CardTitle>
                  <p className="text-xs text-[#4b4f70]">
                    {mockHealthProfile.latestVitals.lastUpdated}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-[#e1d8c7]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7e9a]">
                    Heart Rate
                  </p>
                  <p className="text-xl font-black text-[#111322]">
                    {mockHealthProfile.latestVitals.heartRate}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[#e1d8c7]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7e9a]">
                    Blood Pressure
                  </p>
                  <p className="text-xl font-black text-[#111322]">
                    {mockHealthProfile.latestVitals.bloodPressure}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[#e1d8c7]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7e9a]">
                    SpO2
                  </p>
                  <p className="text-xl font-black text-[#111322]">
                    {mockHealthProfile.latestVitals.spo2}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[#e1d8c7]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a7e9a]">
                    Temperature
                  </p>
                  <p className="text-xl font-black text-[#111322]">
                    {mockHealthProfile.latestVitals.temperature}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card className="border-[2px] border-[#111322] rounded-[32px] shadow-[8px_8px_0_0_#111322] bg-[#fdfbf6]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fdf8e5] border-[2px] border-[#111322] shadow-[3px_3px_0_0_#111322] flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#d4a72c]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#111322]">
                  Current Medications
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockHealthProfile.medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 border border-[#e1d8c7] flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#111322]">{med.name}</p>
                    <p className="text-sm text-[#4b4f70]">{med.frequency}</p>
                  </div>
                  <Badge className="bg-[#f1ede2] text-[#111322] border-[#e1d8c7]">
                    {med.dose}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="border-[2px] border-[#111322] rounded-[32px] shadow-[8px_8px_0_0_#111322] bg-[#fdfbf6]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white border-[2px] border-[#111322] shadow-[3px_3px_0_0_#111322] flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-[#111322]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#111322]">
                  Medical History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockHealthProfile.medicalHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-[#e1d8c7]"
                >
                  <div className="w-2 h-2 rounded-full bg-[#3a3e61] flex-shrink-0" />
                  <p className="text-sm text-[#111322]">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="border-[2px] border-[#111322] rounded-[32px] shadow-[8px_8px_0_0_#111322] bg-[#fdfbf6]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#fee2e2] border-[2px] border-[#111322] shadow-[3px_3px_0_0_#111322] flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#f97373]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#111322]">
                  Emergency Contacts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockHealthProfile.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 border border-[#e1d8c7]"
                >
                  <p className="font-semibold text-[#111322]">{contact.name}</p>
                  <p className="text-sm text-[#4b4f70]">{contact.relationship}</p>
                  <p className="text-sm font-medium text-[#3a3e61] mt-1">
                    {contact.phone}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insurance Info */}
          <Card className="border-[2px] border-[#111322] rounded-[32px] shadow-[8px_8px_0_0_#111322] bg-[#fdfbf6]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f1ede2] border-[2px] border-[#111322] shadow-[3px_3px_0_0_#111322] flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-[#3a3e61]" />
                </div>
                <CardTitle className="text-xl font-bold text-[#111322]">
                  Insurance Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-2xl p-5 border border-[#e1d8c7]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7a7e9a]">
                    Provider
                  </p>
                </div>
                <p className="text-lg font-bold text-[#111322]">
                  {mockHealthProfile.insurance.provider}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7a7e9a]">
                    Policy Number
                  </p>
                </div>
                <p className="text-sm text-[#111322] font-mono">
                  {mockHealthProfile.insurance.policyNumber}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-[#4b4f70]">
          <p>Powered by Vitalyn • Multimodal Healthcare Intelligence</p>
        </div>
      </div>
    </div>
  );
}
