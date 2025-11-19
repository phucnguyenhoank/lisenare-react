import UserRegisterForm from "../components/UserRegisterForm";

export default function RegisterPage() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <UserRegisterForm />
    </div>
  );
}
