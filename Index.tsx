import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Music, BookOpen, GraduationCap, MessageCircle, Trophy, Users, Star, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-music.jpg";

export default function Index() {
  const [liveStats, setLiveStats] = useState({ students: 0, courses: 0, faculty: 0 });

  const fetchStats = async () => {
    const [{ count: students }, { count: courses }, { count: faculty }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "faculty"),
    ]);
    setLiveStats({ students: students ?? 0, courses: courses ?? 0, faculty: faculty ?? 0 });
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel("landing-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchStats)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const stats = [
    { value: `${liveStats.students}+`, label: "Students Enrolled" },
    { value: `${liveStats.courses}+`, label: "Music Courses" },
    { value: `${liveStats.faculty}+`, label: "Expert Faculty" },
    { value: "95%", label: "Success Rate" },
  ];

  const features = [
    { icon: BookOpen, title: "Expert Courses", desc: "Learn from professional musicians across instruments" },
    { icon: GraduationCap, title: "Track Progress", desc: "Monitor grades, achievements, and milestones" },
    { icon: MessageCircle, title: "Direct Communication", desc: "Resolve doubts with faculty in real-time" },
    { icon: Trophy, title: "Earn Achievements", desc: "Get recognized for your musical accomplishments" },
    { icon: Users, title: "Community", desc: "Join a vibrant community of music enthusiasts" },
    { icon: Music, title: "Multiple Instruments", desc: "Guitar, piano, violin, drums, vocals and more" },
  ];
  const steps = [
    { num: "01", title: "Create Your Profile", desc: "Sign up and set up your musical profile with your interests and instrument preferences." },
    { num: "02", title: "Enroll in Courses", desc: "Browse our curated catalog and enroll in courses that match your skill level." },
    { num: "03", title: "Learn & Practice", desc: "Access video lessons, study materials, and practice exercises uploaded by expert faculty." },
    { num: "04", title: "Track & Achieve", desc: "Monitor your grades, earn badges, and celebrate your progress along the way." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">Acadify</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-bg text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Acadify" className="w-full h-full object-cover opacity-25" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8 animate-float">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">The #1 Music Learning Platform</span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Master Your<br /><span className="gradient-text">Musical Journey</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Enroll in expert-led courses, track your grades & achievements, and connect with world-class faculty — all on one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="gradient-bg text-primary-foreground px-8 py-6 text-lg glow animate-pulse-glow">
                Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <p className="text-2xl md:text-3xl font-heading font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Features</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
            Everything You Need to <span className="gradient-text">Excel</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete platform designed for music students and educators to thrive.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-6 hover:glow transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:animate-float">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">How It Works</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-4">
              Your Path to <span className="gradient-text">Mastery</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <span className="text-5xl font-heading font-extrabold text-muted/30">{s.num}</span>
                <h3 className="font-heading text-lg font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-8">
                    <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="py-24 container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-5" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              Ready to Begin Your<br /><span className="gradient-text">Musical Adventure?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Join us now to master your music skills with Acadify. Whether you're a complete beginner or an advanced player, we have the perfect course for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {["No credit card required", "Free starter courses", "Expert instructors"].map((t, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary" /> {t}
                </span>
              ))}
            </div>
            <Link to="/auth">
              <Button size="lg" className="gradient-bg text-primary-foreground px-10 py-6 text-lg glow">
                Join Acadify Today <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Music className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-heading text-lg font-bold text-foreground">Acadify</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The modern platform for music education. Learn, grow, and achieve your musical dreams.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-3">Instruments</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Guitar & Bass</li>
                <li>Piano & Keyboard</li>
                <li>Violin & Strings</li>
                <li>Vocals & Drums</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            <p>© 2026 Acadify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
