import React, { useEffect, useRef } from "react";
import { FileText, Users, ChartNoAxesCombined, HeartHandshake, Zap } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: FileText,
    title: "Resume Skill Extraction",
    text: "Upload PDFs and let our engine extract technical skills automatically, removing manual data entry.",
    tag: "Core",
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

function FeaturesTrack() {
  const sectionRef = useRef(null);
  const cardTrackRef = useRef(null);
  const cardsRef = useRef([]);

  const xTo = useRef([]);
  const yTo = useRef([]);
  const iconXTo = useRef([]);
  const iconYTo = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      if (isReducedMotion) {
        gsap.set(cardsRef.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (isDesktop) {
        // Entrance animation
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, ease: "power3.out", stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          }
        );

        const trackWidth = cardTrackRef.current.scrollWidth;
        const windowWidth = window.innerWidth;
        const totalScrollDistance = trackWidth - windowWidth + (windowWidth * 0.1);

        gsap.to(cardTrackRef.current, {
          x: () => -(totalScrollDistance),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalScrollDistance}`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // Setup mouse parallax for each card
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          xTo.current[i] = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3" });
          yTo.current[i] = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3" });
          
          const icon = card.querySelector('.parallax-icon');
          if (icon) {
            iconXTo.current[i] = gsap.quickTo(icon, "x", { duration: 0.8, ease: "power3" });
            iconYTo.current[i] = gsap.quickTo(icon, "y", { duration: 0.8, ease: "power3" });
          }
        });
      } else {
        // Mobile stack animation
        cardsRef.current.forEach((card) => {
          gsap.fromTo(
            card, { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Normalized position from -1 to 1
    const normalizedX = (clientX - centerX) / centerX;
    const normalizedY = (clientY - centerY) / centerY;
    
    const maxCardMove = 8;
    const maxIconMove = 4; // Moves at 50% speed relative to card

    cardsRef.current.forEach((_, i) => {
      if (xTo.current[i]) xTo.current[i](normalizedX * maxCardMove);
      if (yTo.current[i]) yTo.current[i](normalizedY * maxCardMove);
      if (iconXTo.current[i]) iconXTo.current[i](normalizedX * maxIconMove);
      if (iconYTo.current[i]) iconYTo.current[i](normalizedY * maxIconMove);
    });
  };

  const handleMouseLeave = () => {
    cardsRef.current.forEach((_, i) => {
      if (xTo.current[i]) xTo.current[i](0);
      if (yTo.current[i]) yTo.current[i](0);
      if (iconXTo.current[i]) iconXTo.current[i](0);
      if (iconYTo.current[i]) iconYTo.current[i](0);
    });
  };

  return (
    <section 
      id="features" 
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#F9FAFB] py-24 z-10"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(225,37,27,0.04)] blur-[100px]" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 mb-16 md:mb-24">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#6B7280]">everything you need</p>
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] md:text-5xl">
          <span className="text-[#E1251B]">Faster And Better</span> than manual picking.
        </h2>
        <p className="mt-4 max-w-2xl text-base font-normal text-[#6B7280]">
          Intelligent tools to manage the perfect hackathon. From solo developer to a balanced team in minutes.
        </p>
      </div>

      <div 
        ref={cardTrackRef} 
        className="flex flex-col md:flex-row md:flex-nowrap items-start px-5 sm:px-8 md:pl-[max(2rem,calc((100vw-1400px)/2+2rem))] gap-7 md:gap-0"
        style={{ willChange: "transform" }}
      >
        {features.map((item, idx) => (
          <div
            key={item.title}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="group relative flex-shrink-0 w-full md:w-[320px] lg:w-[420px] rounded-[28px] border border-[#E5E7EB] bg-white/70 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.07)] backdrop-blur-[12px] transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2.5 hover:scale-[1.03] hover:border-[rgba(225,37,27,0.25)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] md:-mr-4 last:mr-[10vw]"
            style={{ willChange: "transform, opacity" }}
            tabIndex={0}
          >
            {item.tag && (
              <span className="absolute right-6 top-6 rounded-full bg-[#E1251B] px-3 py-1 text-xs font-bold tracking-wide text-white">
                {item.tag}
              </span>
            )}
            
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
              <div className={`parallax-icon flex h-full w-full items-center justify-center bg-gray-50 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110`}>
                <item.icon className={`h-7 w-7 text-gray-700 group-hover:text-[#E1251B] transition-colors`} />
              </div>
            </div>

            <h3 className="mb-3 text-xl font-semibold text-[#111827]">{item.title}</h3>
            <p className="text-sm leading-relaxed text-[#6B7280]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesTrack;
