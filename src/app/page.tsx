import OuraWidget from "@/components/OuraWidget";
import MealMacros from "@/components/MealMacros";
import WorkoutSchedule from "@/components/WorkoutSchedule";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-12 border-b border-gray-800 pb-6 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl text-yellow-400" style={{ fontFamily: "var(--font-press-start)" }}>
          GUSUP V2
        </h1>
        <p className="mt-4 text-gray-400">Personal Health & Performance Dashboard</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <OuraWidget />
          <MealMacros />
        </div>
        <div>
          <WorkoutSchedule />
        </div>
      </div>
    </main>
  );
}
