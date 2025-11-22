import { useState } from "react";
import UsernameStep from "../registerSteps/UsernameStep";
import LevelStep from "../registerSteps/LevelStep";
import TopicStep from "../registerSteps/TopicStep";
import GoalAgeStep from "../registerSteps/GoalAgeStep";
import EmailStep from "../registerSteps/EmailStep";
import { registerOrLogin } from "../api/users";
import { useNavigate } from "react-router-dom";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Global registration data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    user_level: 0,
    topics: [],
    goal_type: 0,
    age_group: 0,
    email: "",
  });

  const updateField = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleRegister = async () => {
    try {
      const res = await registerOrLogin(formData);
      console.error(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {step === 1 && <UsernameStep data={formData} updateField={updateField} next={() => setStep(2)} />}
      {step === 2 && <LevelStep data={formData} updateField={updateField} next={() => setStep(3)} back={() => setStep(1)} />}
      {step === 3 && <TopicStep data={formData} updateField={updateField} next={() => setStep(4)} back={() => setStep(2)} />}
      {step === 4 && <GoalAgeStep data={formData} updateField={updateField} next={() => setStep(5)} back={() => setStep(3)} />}
      {step === 5 && <EmailStep data={formData} updateField={updateField} back={() => setStep(4)} submit={handleRegister} />}
      <button
        className="text-blue-600 underline p-2 rounded"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}
