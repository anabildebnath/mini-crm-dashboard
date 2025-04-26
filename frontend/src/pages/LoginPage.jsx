// frontend/src/pages/LoginPage.jsx
import React from "react";
import { LoginForm } from "../components/login-form.jsx";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm />
    </div>
  );
}
