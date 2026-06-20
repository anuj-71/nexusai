import StartupOnboardingForm from "@/components/startup-onboarding-form"

export default function Page() {
  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="mb-6 text-2xl font-serif font-bold text-foreground">Startup Onboarding</h1>
        <StartupOnboardingForm />
      </div>
    </div>
  )
}
