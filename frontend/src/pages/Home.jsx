import { FileText, Users, ChartNoAxesCombined, HeartHandshake, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/home/AnimatedBackground";
import Hero from "../components/home/Hero";
import FeatureCard from "../components/home/FeatureCard";
import Timeline from "../components/home/Timeline";
import DashboardPreview from "../components/home/DashboardPreview";
import Stats from "../components/home/Stats";
import Footer from "../components/home/Footer";

const features = [
  {
    icon: FileText,
    title: "Resume Skill Extraction",
    text: "Upload PDFs and let our engine extract technical skills automatically, removing manual data entry.",
  },
  {
    icon: Users,
    title: "Smart Team Matching",
    text: "Generate teams around specific required roles and skill gaps instead of random grouping.",
  },
  {
    icon: HeartHandshake,
    title: "Team Chemistry",
    text: "Compatibility scores based on overlapping interests, complementary skills, and shared goals.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Analytics Dashboard",
    text: "Monitor workspace health, team formation progress, and skill distributions in real-time.",
  },
  {
    icon: Zap,
    title: "AI Team Builder",
    text: "Our intelligence engine resolves the 'who goes where' problem instantly for large hackathons.",
  },
];

function Home() {
  return (
    <div className="bg-white text-gray-900">
      <AnimatedBackground />

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-5 py-32 sm:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Intelligent tools to manage the perfect hackathon.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              text={feature.text}
              delay={idx * 0.08}
            />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <div className="relative z-10">
        <Timeline />
      </div>

      {/* Dashboard Preview */}
      <div className="relative z-10">
        <DashboardPreview />
      </div>

      {/* Stats */}
      <div className="relative z-10">
        <Stats />
      </div>

      {/* Final CTA */}
      <section id="contact" className="relative z-10 overflow-hidden py-32 text-center px-5">
        <div className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E1251B]/5 blur-[100px]" />

        <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Build Better Teams with <span className="text-[#E1251B]">AI</span>
        </h2>

        <div className="mt-10">
          <Link
            to="/team-builder"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-10 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
