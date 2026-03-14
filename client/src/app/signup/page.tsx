import Link from "next/link";
import { HiCheck } from "react-icons/hi";
import SignupForm from "@/components/signup/SignupForm";
import { SignupFlowProvider } from "@/contexts/SignupFlowContext";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-4">
            <HiCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start managing tasks with FlowTask</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 p-8">
          <SignupFlowProvider>
            <SignupForm />
          </SignupFlowProvider>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
