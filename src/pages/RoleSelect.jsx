import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/AuthContext.jsx";
import { GraduationCap, UserCog, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RoleSelection() {
  const { user, loading, setRole } = useAuth();
  const navigate = useNavigate();
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login", { replace: true });
    if (user?.role) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  async function pick(role) {
    if (selecting) return;
    setSelecting(true);
    try {
      const result = await setRole(role);
      // If student, go to dashboard. If lecturer/manager, show pending message
      if (role === "student") {
        navigate("/dashboard", { replace: true });
      } else {
        // Show message that request is pending
        const message = result?.message || `Your request to become a ${role} has been submitted. You will be notified once an admin approves your request. For now, you can use the system as a student.`;
        alert(message + "\n\nYou can use the system as a student while waiting for approval.");
        // Navigate to dashboard - user should now have student role
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Failed to set role:", err);
      const errorMsg = err?.message || "Failed to set role. Please try again.";
      alert(errorMsg);
      setSelecting(false);
    }
  }

  const roles = [
    {
      id: "student",
      title: "Student",
      description: "Library status, labs, fault reporting",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverColor: "hover:border-blue-300 hover:shadow-blue-100",
    },
    {
      id: "lecturer",
      title: "Lecturer",
      description: "Student features + room booking",
      icon: UserCog,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverColor: "hover:border-purple-300 hover:shadow-purple-100",
    },
    {
      id: "manager",
      title: "Manager",
      description: "Approvals, fault management, reports",
      icon: Briefcase,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      hoverColor: "hover:border-emerald-300 hover:shadow-emerald-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Navigation Bar */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold shadow-md">
            CH
          </div>
          <div className="font-semibold text-slate-900">CampusHub</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Choose Your Role
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
            Select your role to access the appropriate features and permissions. 
            This determines what pages and capabilities you'll have access to.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <RoleCard
                key={role.id}
                role={role}
                Icon={Icon}
                onClick={() => pick(role.id)}
                disabled={selecting}
              />
            );
          })}
        </div>

        {selecting && (
          <div className="mt-8 text-center text-slate-500 text-sm">
            Setting up your account...
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({ role, Icon, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative text-left bg-white border-2 ${role.borderColor} rounded-2xl shadow-sm p-6 md:p-8 transition-all duration-200 ${role.hoverColor} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {/* Icon */}
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${role.color} text-white shadow-md mb-4`}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Title */}
      <div className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
        {role.title}
      </div>

      {/* Description */}
      <div className="text-slate-500 text-sm md:text-base mb-6 leading-relaxed">
        {role.description}
      </div>

      {/* Select Indicator */}
      <div className="flex items-center gap-2 text-slate-700 font-medium group-hover:gap-3 transition-all">
        <span>Select</span>
        <ArrowRight className="h-4 w-4" />
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 rounded-2xl ${role.bgColor} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
    </button>
  );
}
