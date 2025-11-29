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

  const TOTAL_STEPS = 5;

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    user_level: 0,
    preference_topic_ids: [],
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
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-sm border">

        {/* Progress indicator */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">Step {step} of {TOTAL_STEPS}</p>

          <div className="flex-1 ml-4 h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-black rounded-full transition-all"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Steps */}
        {step === 1 && (
          <UsernameStep
            data={formData}
            updateField={updateField}
            next={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <LevelStep
            data={formData}
            updateField={updateField}
            next={() => setStep(3)}
            back={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <TopicStep
            data={formData}
            updateField={updateField}
            next={() => setStep(4)}
            back={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <GoalAgeStep
            data={formData}
            updateField={updateField}
            next={() => setStep(5)}
            back={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <EmailStep
            data={formData}
            updateField={updateField}
            back={() => setStep(4)}
            submit={handleRegister}
          />
        )}

        {/* Login link */}
        <button
          className="mt-6 block mx-auto text-gray-600 underline hover:text-black transition cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>

      </div>
    </div>
  );
}
