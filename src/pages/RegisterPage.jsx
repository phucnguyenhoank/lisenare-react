// src/pages/RegisterPage.jsx
import UserRegisterForm from "../components/UserRegisterForm";

export default function RegisterPage() {
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <UserRegisterForm />
    </div>
  );
}
