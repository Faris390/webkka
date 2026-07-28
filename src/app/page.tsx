"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    classOrGugus: "",
    nis: "",
    telegram: "",
    whatsapp: "",
    reason: "",
    expectation: "",
    experience: "",
    commitment: "",
    infoSource: "",
    infoSourceOther: "",
    projectExperience: "",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.gender || !formData.classOrGugus || !formData.nis || !formData.telegram || !formData.whatsapp) {
      setErrorMsg("Harap lengkapi semua kolom wajib!");
      return;
    }
    setErrorMsg("");
    setModalStep(2);
  };

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    document
      .querySelectorAll(".reveal-fade-up, .reveal-fade-left, .reveal-fade-right")
      .forEach((el) => {
        revealObserver.observe(el);
      });

    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".glass-panel") as NodeListOf<HTMLElement>;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        }
      });
    };
    document.addEventListener("mousemove", handleMouseMove);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    const canvas = canvasRef.current;
    let animationFrameId: number;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let W = (canvas.width = window.innerWidth);
        let H = (canvas.height = window.innerHeight);

        const isMobile = W < 768;
        const starCount = isMobile ? 50 : 120;

        const stars = Array.from({ length: starCount }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          speed: Math.random() * 0.25 + 0.05,
          opacity: Math.random() * 0.7 + 0.2,
          twinkleOffset: Math.random() * Math.PI * 2,
        }));
        let frame = 0;

        const draw = () => {
          ctx.clearRect(0, 0, W, H);
          frame++;
          stars.forEach((s) => {
            const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.03 + s.twinkleOffset);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 210, 255, ${s.opacity * twinkle})`;
            ctx.fill();
            s.y -= s.speed;
            if (s.y < -2) {
              s.y = H + 2;
              s.x = Math.random() * W;
            }
          });
          animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        const handleResize = () => {
          W = canvas.width = window.innerWidth;
          H = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleResize);
          cancelAnimationFrame(animationFrameId);
        };
      }
    }
  }, [isLoading]);

  useEffect(() => {
    const minTime = 2000;
    const start = Date.now();

    const exitLoading = () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, minTime - elapsed);
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsLoading(false);
          document.body.classList.remove("overflow-hidden");
        }, 850);
      }, delay);
    };

    exitLoading();
  }, []);

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.reason || !formData.experience || !formData.commitment || !formData.infoSource) {
      setErrorMsg("Harap lengkapi semua kolom wajib!");
      return;
    }

    setIsSubmitting(true);
    setFormStatus("Mengirim data...");

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalStep(3);
      } else {
        setFormStatus("Gagal mengirim data. Silakan coba lagi.");
      }
    } catch (err) {
      setFormStatus("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>
      <div className="ambient-blob blob-3"></div>

      {isLoading && (
        <div
          id="loading-screen"
          className={`fixed inset-0 z-[9999] overflow-hidden ${isFadingOut ? "ls-exit" : ""}`}
        >
          <div className="ls-bg"></div>
          <canvas ref={canvasRef} id="ls-stars" className="absolute inset-0 w-full h-full"></canvas>
          <div className="ls-grid"></div>
          <div className="ls-shockwave"></div>
          <div className="ls-shockwave" style={{ animationDelay: "0.4s" }}></div>
          <div className="ls-scan-beam"></div>
          <div className="ls-hud ls-hud-tl">
            <span></span>
            <span></span>
          </div>
          <div className="ls-hud ls-hud-tr">
            <span></span>
            <span></span>
          </div>
          <div className="ls-hud ls-hud-bl">
            <span></span>
            <span></span>
          </div>
          <div className="ls-hud ls-hud-br">
            <span></span>
            <span></span>
          </div>
          <div className="ls-shard ls-shard-1"></div>
          <div className="ls-shard ls-shard-2"></div>
          <div className="ls-shard ls-shard-3"></div>
          <div className="ls-shard ls-shard-4"></div>
          <div className="ls-shard ls-shard-5"></div>
          <div className="ls-shard ls-shard-6"></div>
          <div className="ls-shard ls-shard-7"></div>
          <div className="ls-shard ls-shard-8"></div>
          <div className="ls-center">
            <div className="ls-orbit-ring"></div>
            <div className="ls-orbit-ring ls-orbit-ring-2"></div>
            <div className="ls-logo-wrap">
              <div className="ls-logo-1">
                <img src="/loading.png" alt="Logo KKA" className="ls-logo-img" />
                <div className="ls-logo-aura"></div>
              </div>
              <div className="ls-logo-2">
                <img src="/loading2.png" alt="Logo Smanda" className="ls-logo-img" />
                <div className="ls-logo-aura ls-logo-aura-2"></div>
              </div>
            </div>
            <div className="ls-title" data-text="KKA SMANDA 26">
              KKA SMANDA 26
            </div>
            <div className="ls-subtitle">Koding & Kecerdasan Artificial</div>
            <div className="ls-bar-wrap">
              <div className="ls-bar-track">
                <div className="ls-bar-fill"></div>
                <div className="ls-bar-spark"></div>
              </div>
              <div className="ls-bar-label">INITIALIZING SYSTEM...</div>
            </div>
          </div>
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-md transition-all duration-300 ${headerScrolled ? "bg-surface/95 h-16" : "bg-surface/80 h-20"
          }`}
      >
        <nav className="max-w-7xl mx-auto px-container-padding flex justify-between items-center h-full">
          <div className="flex items-center gap-3">
            <img
              src="/loading2.png"
              alt="KKA Logo"
              className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(128,131,255,0.8)] transition-transform duration-300 hover:scale-110"
            />
            <span className="font-display-lg text-headline-md font-extrabold text-on-surface">
              KKA <span className="text-primary">SMANDA 26</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">
              Home
            </a>
            <button
              className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Join Us
            </button>
            <a
              className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-colors"
              href="https://wa.me/6281358909827"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 mr-4">
              <button className="p-2 hover:bg-white/5 transition-all duration-300 rounded-full">
                <span className="material-symbols-outlined text-on-surface-variant">terminal</span>
              </button>
              <button className="p-2 hover:bg-white/5 transition-all duration-300 rounded-full">
                <span className="material-symbols-outlined text-on-surface-variant">code</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div className="fixed top-20 left-0 right-0 z-10 ticker-wrap h-10 flex items-center">
        <div className="ticker-content flex gap-12 font-label-sm text-label-sm text-primary uppercase tracking-widest items-center pr-12">
          <span>• Registration for KKA Smanda 2026 is now OPEN</span>
          <span>• Congratulations to Smanda OSN Team for Winning National Olympiad</span>
          <span>• Join our Weekly Activities every Wednesday & Thursday at 3.30 PM</span>
          <span>• Registration for KKA Smanda 2026 is now OPEN</span>
          <span>• Registration for KKA Smanda 2026 is now OPEN</span>
          <span>• Congratulations to Smanda OSN Team for Winning National Olympiad</span>
          <span>• Join our Weekly Activities every Wednesday & Thursday at 3.30 PM</span>
          <span>• Registration for KKA Smanda 2026 is now OPEN</span>
        </div>
      </div>

      <main className="relative pt-32">
        <section className="relative max-w-6xl mx-auto px-container-padding py-section-gap flex flex-col items-center text-center">
          <h1
            className="font-display-lg text-display-lg mb-6 max-w-4xl tracking-tight leading-none reveal-fade-up"
            style={{ transitionDelay: "0.1s" }}
          >
            Eksplorasi Dunia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">
              Informatika & Teknologi
            </span>
          </h1>
          <p
            className="font-body-base text-body-base text-on-surface-variant max-w-2xl mb-10 leading-relaxed reveal-fade-up"
            style={{ transitionDelay: "0.2s" }}
          >
            Wadah berkumpulnya Anomali Smanda, Kami disini sebagai Tim/Group Belajar yang siap ada untuk
            saling belajar. Menembus batas kode dan kreativitas digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-20 reveal-fade-up" style={{ transitionDelay: "0.3s" }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-white font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2 relative overflow-hidden group cursor-pointer border-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                Gabung Sekarang
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
            </button>
            <a
              href="#jadwal"
              className="glass-panel text-on-surface font-bold px-10 py-4 rounded-xl text-lg hover:bg-white/10 transition-all text-center flex items-center justify-center"
            >
              Jadwal & Kegiatan
            </a>
          </div>
          <div
            className="w-full max-w-3xl glass-panel rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 reveal-fade-up animate-float"
            style={{ transitionDelay: "0.4s" }}
          >
            <div className="bg-surface-container flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <div className="w-3 h-3 rounded-full bg-tertiary-container"></div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant opacity-60">main.js</span>
            </div>
            <div className="p-8 text-left font-code-snippet text-code-snippet leading-relaxed overflow-x-auto">
              <pre>
                <code className="block">
                  <span className="syntax-keyword">const</span> <span className="syntax-variable">club</span> = {"{"}
                  <br />
                  {"    "}<span className="syntax-variable">name</span>: <span className="syntax-string">'KKA Smanda'</span>,
                  <br />
                  {"    "}<span className="syntax-variable">passion</span>: <span className="syntax-string">'Technology & Coding'</span>,
                  <br />
                  {"    "}<span className="syntax-variable">members</span>: <span className="syntax-string">'???'</span>,
                  <br />
                  {"    "}<span className="syntax-variable">isAwesome</span>: <span className="syntax-keyword">true</span>,
                  <br />
                  {"    "}<span className="syntax-variable">join</span>: () =&gt; {"{"}
                  <br />
                  {"        "}<span className="syntax-variable">console</span>.<span className="syntax-variable">log</span>(<span className="syntax-string">'Welcome to the future!'</span>);
                  <br />
                  {"    "}{"}"}
                  <br />
                  {"}"};
                  <br />
                  <br />
                  <span className="syntax-comment">// Eksekusi perjalananmu disini</span>
                  <br />
                  <span className="syntax-variable">club</span>.<span className="syntax-variable">join</span>();
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-container-padding py-section-gap">
          <div className="text-center mb-16 reveal-fade-up">
            <h2 className="font-display-lg text-headline-md mb-4">Core Competencies</h2>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-xl mx-auto">
              Kami fokus pada tiga pilar utama pengembangan teknologi di lingkungan sekolah.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="glass-panel p-8 rounded-3xl hover:bg-surface-container-high transition-all group flex flex-col h-full reveal-fade-left">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">Coding & Web</h3>
              <p className="font-body-base text-body-base text-on-surface-variant mb-6 flex-grow">
                Mempelajari fundamental pemrograman, pengembangan web modern, hingga software engineering yang scalable.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">
                  JS
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">
                  Python
                </span>
              </div>
            </div>
            <div
              className="glass-panel p-8 rounded-3xl hover:bg-surface-container-high transition-all group border-t-2 border-secondary/30 flex flex-col h-full reveal-fade-up"
              style={{ transitionDelay: "0.15s" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-3xl">psychology</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">Artificial Intelligence</h3>
              <p className="font-body-base text-body-base text-on-surface-variant mb-6 flex-grow">
                Implementasi machine learning, prompt engineering, dan pemanfaatan AI untuk efisiensi akademik.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">
                  LLMs
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">
                  Data Science
                </span>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-3xl hover:bg-surface-container-high transition-all group flex flex-col h-full reveal-fade-right">
              <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary text-3xl">precision_manufacturing</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4 text-on-surface">Robotics & IoT</h3>
              <p className="font-body-base text-body-base text-on-surface-variant mb-6 flex-grow">
                Integrasi hardware dan software melalui Arduino, Raspberry Pi, dan pengembangan sistem otomasi pintar.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">
                  Arduino
                </span>
                <span className="bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase">
                  Sensors
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="jadwal" className="max-w-7xl mx-auto px-container-padding py-section-gap">
          <div className="text-center mb-12 reveal-fade-up">
            <h2 className="font-display-lg text-headline-md mb-3">Jadwal Kegiatan</h2>
          </div>
          <div className="glass-panel rounded-3xl overflow-hidden reveal-fade-up">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-6 py-4 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                      Hari
                    </th>
                    <th className="text-left px-6 py-4 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                      Waktu
                    </th>
                    <th className="text-left px-6 py-4 text-primary font-label-sm text-label-sm uppercase tracking-widest">
                      Tempat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-on-surface">Rabu</td>
                    <td className="px-6 py-4 text-on-surface-variant">15:30 – Selesai</td>
                    <td className="px-6 py-4 text-on-surface-variant">Lab Komputer 2</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-on-surface">Kamis</td>
                    <td className="px-6 py-4 text-on-surface-variant">15:30 – Selesai</td>
                    <td className="px-6 py-4 text-on-surface-variant">Lab Komputer 2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-section-gap overflow-hidden">
          <div className="text-center mb-12 max-w-7xl mx-auto px-container-padding reveal-fade-up">
            <div className="inline-block px-4 py-1.5 mb-4 glass-panel rounded-full text-tertiary font-label-sm text-label-sm border border-tertiary/20 uppercase tracking-widest">
              Momen Kami
            </div>
            <h2 className="font-display-lg text-headline-md mb-3">Galeri Kegiatan</h2>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-xl mx-auto">
              Sekilas perjalanan KKA Smanda dalam setiap momen berharga.
            </p>
          </div>
          <div className="gallery-track-wrapper mb-5">
            <div className="gallery-track gallery-track--ltr">
              <div className="gallery-slide">
                <img src="/foto1.jpeg" alt="Foto 1" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto2.jpeg" alt="Foto 2" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto3.jpeg" alt="Foto 3" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto4.jpeg" alt="Foto 4" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto5.jpeg" alt="Foto 5" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto1.jpeg" alt="Foto 1" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto2.jpeg" alt="Foto 2" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto3.jpeg" alt="Foto 3" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto4.jpeg" alt="Foto 4" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto5.jpeg" alt="Foto 5" loading="lazy" />
              </div>
            </div>
          </div>
          <div className="gallery-track-wrapper">
            <div className="gallery-track gallery-track--rtl">
              <div className="gallery-slide">
                <img src="/foto6.jpeg" alt="Foto 6" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto7.jpeg" alt="Foto 7" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto8.jpeg" alt="Foto 8" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto9.jpeg" alt="Foto 9" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto6.jpeg" alt="Foto 6" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto7.jpeg" alt="Foto 7" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto8.jpeg" alt="Foto 8" loading="lazy" />
              </div>
              <div className="gallery-slide">
                <img src="/foto9.jpeg" alt="Foto 9" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-gap overflow-hidden relative">
          <div className="text-center mb-16 max-w-7xl mx-auto px-container-padding reveal-fade-up">
            <div className="inline-block px-4 py-1.5 mb-4 glass-panel rounded-full text-secondary font-label-sm text-label-sm border border-secondary/20 uppercase tracking-widest">
              Kepengurusan
            </div>
            <h2 className="font-display-lg text-headline-md mb-3">Struktur Organisasi</h2>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-xl mx-auto">
              Para pengurus KKA Smanda 26.
            </p>
            <div className="mx-auto px-container-padding relative org-chart flex flex-col items-center mt-8">
              <div className="org-card org-card-pembina glass-panel group relative z-10 border hover:border-primary/50 transition-colors">
                <div className="org-avatar bg-primary/20 text-primary group-hover:shadow-[0_0_20px_rgba(128,131,255,0.4)] transition-shadow">
                  <img src="/kpembina.jpeg" alt="Pembina" className="w-full h-full object-cover" />
                </div>
                <h3 className="org-name group-hover:text-primary transition-colors duration-300">
                  Hakim Akbar S.Mat
                  <span className="block text-xs font-normal opacity-70 mt-1 group-hover:opacity-100 transition-opacity">
                    @hakimakbarmaulana
                  </span>
                </h3>
                <p className="org-role text-primary mt-2">Pembina</p>
              </div>
              <div className="org-lines reveal-fade-up" style={{ transitionDelay: "0.2s" }}>
                <div className="line-vertical"></div>
                <div className="line-horizontal-left"></div>
                <div className="line-horizontal-right"></div>
                <div className="line-vertical-left"></div>
                <div className="line-vertical-right"></div>
              </div>
              <div className="org-bottom-row relative z-10" style={{ transitionDelay: "0.4s" }}>
                <div className="org-card org-card-ketua glass-panel group border hover:border-secondary/50 transition-colors">
                  <div className="org-avatar bg-secondary/20 text-secondary group-hover:shadow-[0_0_20px_rgba(162,0,255,0.4)] transition-shadow">
                    <img src="/ketua.jpeg" alt="Ketua" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="org-name group-hover:text-secondary transition-colors duration-300">
                    Panji A.R (XII-A1)
                    <span className="block text-xs font-normal opacity-70 mt-1 group-hover:opacity-100 transition-opacity">
                      @panjiathallah_
                    </span>
                  </h3>
                  <p className="org-role text-secondary mt-2">Ketua</p>
                </div>

                <div className="org-card org-card-waka glass-panel group border hover:border-tertiary/50 transition-colors">
                  <div className="org-avatar bg-tertiary/20 text-tertiary group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-shadow">
                    <img src="/kwakil.jpeg" alt="Wakil Ketua" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="org-name group-hover:text-tertiary transition-colors duration-300">
                    Novim Adi P. (XI-A4)
                    <span className="block text-xs font-normal opacity-70 mt-1 group-hover:opacity-100 transition-opacity">
                      @v3mm_
                    </span>
                  </h3>
                  <p className="org-role text-tertiary mt-2">Wakil Ketua</p>
                </div>
              </div>
            </div>
            <div className="mt-16 relative z-10 reveal-fade-up" style={{ transitionDelay: "0.6s" }}>
              <div className="text-center mb-6 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#8083ff]"></span>
                  <span className="org-role text-primary text-[10px] md:text-[12px] tracking-widest font-bold">WEB DEVELOPED BY:</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="org-card-webdev glass-panel group flex items-center p-3 rounded-full relative overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-default w-full md:w-auto max-w-[320px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

                  <div className="org-avatar-webdev shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors duration-300 shadow-[0_0_15px_rgba(128,131,255,0.2)] group-hover:shadow-[0_0_25px_rgba(128,131,255,0.5)]">
                    <img src="/webdev.jpeg" alt="Faris Hidayat" className="w-full h-full object-cover" />
                  </div>

                  <div className="ml-4 md:ml-5 text-left pr-6 md:pr-10 relative z-10">
                    <h3 className="font-display-lg text-headline-sm text-primary group-hover:text-white transition-colors duration-300 text-sm md:text-base font-bold">
                      Faris Hidayat (XI-F1)
                    </h3>
                    <span className="block text-[10px] md:text-xs font-normal opacity-70 group-hover:opacity-100 transition-opacity text-on-surface-variant mt-0.5">
                      @risshyt.css
                    </span>
                    <p className="org-role text-primary mt-1 text-[9px] md:text-[10px] tracking-widest font-semibold flex items-center gap-1.5">
                      DEVELOPER
                    </p>
                  </div>
                </div>

                <div className="org-card-webdev glass-panel group flex items-center p-3 rounded-full relative overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-default w-full md:w-auto max-w-[320px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

                  <div className="org-avatar-webdev shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors duration-300 shadow-[0_0_15px_rgba(128,131,255,0.2)] group-hover:shadow-[0_0_25px_rgba(128,131,255,0.5)]">
                    <img src="/webdev2.jpeg" alt="Web Developer 2" className="w-full h-full object-cover" />
                  </div>

                  <div className="ml-4 md:ml-5 text-left pr-6 md:pr-10 relative z-10">
                    <h3 className="font-display-lg text-headline-sm text-primary group-hover:text-white transition-colors duration-300 text-sm md:text-base font-bold">
                      Syifan Maulana (XII-A1)
                    </h3>
                    <span className="block text-[10px] md:text-xs font-normal opacity-70 group-hover:opacity-100 transition-opacity text-on-surface-variant mt-0.5">
                      @ci.pnnn
                    </span>
                    <p className="org-role text-primary mt-1 text-[9px] md:text-[10px] tracking-widest font-semibold flex items-center gap-1.5">
                      DEVELOPER
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-container-padding">
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 reveal-fade-up">
              <div className="stat-bubble reveal-fade-up" style={{ transitionDelay: "0s" }}>
                <div className="text-3xl font-extrabold text-primary mb-1">???</div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Members</div>
              </div>
              <div className="stat-bubble reveal-fade-up" style={{ transitionDelay: "0.15s" }}>
                <div className="text-3xl font-extrabold text-secondary mb-1">20++</div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Projects</div>
              </div>
              <div className="stat-bubble reveal-fade-up" style={{ transitionDelay: "0.3s" }}>
                <div className="text-3xl font-extrabold text-tertiary mb-1">???++</div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold text-center leading-tight px-2">
                  Member Achievements
                </div>
              </div>
              <div className="stat-bubble reveal-fade-up" style={{ transitionDelay: "0.45s" }}>
                <div className="text-3xl font-extrabold text-primary mb-1">4</div>
                <div className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Division</div>
              </div>
            </div>
          </div>
        </section>


        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => { if (modalStep !== 3 && !isSubmitting) setIsModalOpen(false) }}
            ></div>

            <div className="relative bg-surface border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-low">
                <h3 className="font-display-lg text-xl font-bold text-primary">
                  {modalStep === 1 && "Form Pendaftaran - Page 1"}
                  {modalStep === 2 && "Form Pendaftaran - Page 2"}
                  {modalStep === 3 && "Pendaftaran Berhasil!"}
                </h3>
                {modalStep !== 3 && !isSubmitting && (
                  <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-white transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow bg-surface">
                {modalStep === 1 && (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Nama Lengkap <span className="text-error">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="Masukkan nama lengkap" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Jenis Kelamin <span className="text-error">*</span></label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-Laki">Laki-Laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Kelas/Gugus <span className="text-error">*</span></label>
                      <select name="classOrGugus" value={formData.classOrGugus} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="">Pilih Kelas/Gugus</option>
                        {["Papaiya", "Lavanya", "Brassica", "Amrata", "Sativa", "Manira", "Kalpika", "Granata", "Nucera", "Pallava", "Artora", "Mawala", "XI-A1", "XI-A2", "XI-A3", "XI-A4", "XI-B1", "XI-B2", "XI-C", "XI-D", "XI-E1", "XI-E2", "XI-F1", "XI-F2"].map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">NIS (Kelas 11) / NISN (Kelas 10) <span className="text-error">*</span></label>
                      <input type="text" name="nis" value={formData.nis} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Username Telegram <span className="text-error">*</span></label>
                      <input type="text" name="telegram" value={formData.telegram} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="@username" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Nomor WhatsApp <span className="text-error">*</span></label>
                      <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="08..." />
                    </div>

                    {errorMsg && (
                      <div className="text-center p-3 bg-error/20 border border-error/50 rounded-lg text-error font-medium text-sm mb-2">
                        {errorMsg}
                      </div>
                    )}
                    <div className="flex justify-end mt-4">
                      <button onClick={handleNextStep} className="btn-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg border-none cursor-pointer flex items-center gap-2 hover:-translate-y-1 transition-transform">
                        Selanjutnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {modalStep === 2 && (
                  <form onSubmit={handleJoinSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Apa alasan kamu mengikuti klub mapel KKA? <span className="text-error">*</span></label>
                      <textarea name="reason" value={formData.reason} onChange={handleInputChange} required rows={3} className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Apa harapan kamu setelah bergabung dalam klub mapel?</label>
                      <textarea name="expectation" value={formData.expectation} onChange={handleInputChange} rows={2} className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Ceritakan Pengalaman Kamu di jenjang sekolah sebelumnya yang berkaitan dengan tujuan kamu kedepannya di SMA! <span className="text-error">*</span></label>
                      <textarea name="experience" value={formData.experience} onChange={handleInputChange} required rows={3} className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Apakah kamu berkomitmen untuk mengikuti kegiatan klub dengan rutin? <span className="text-error">*</span></label>
                      <select name="commitment" value={formData.commitment} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="">Pilih...</option>
                        <option value="Ya">Ya</option>
                        <option value="Tidak">Tidak</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-semibold text-on-surface-variant">Tahu informasi OPREC klub mapel dari mana? <span className="text-error">*</span></label>
                      <div className="flex flex-col gap-3">
                        {["Instagram", "Stand Klub Mapel", "Teman", "Kakak Kelas", "Other"].map(source => (
                          <label key={source} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-5 h-5">
                              <input
                                type="radio"
                                name="infoSource"
                                value={source}
                                checked={formData.infoSource === source}
                                onChange={handleInputChange}
                                required
                                className="appearance-none w-5 h-5 rounded-full border-2 border-white/30 checked:border-primary transition-colors cursor-pointer"
                              />
                              {formData.infoSource === source && (
                                <div className="absolute w-2.5 h-2.5 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <span className="text-white group-hover:text-primary transition-colors">{source}</span>
                          </label>
                        ))}
                      </div>
                      {formData.infoSource === "Other" && (
                        <input type="text" name="infoSourceOther" value={formData.infoSourceOther} onChange={handleInputChange} required placeholder="Sebutkan dari mana..." className="mt-2 bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface-variant">Apakah kamu sebelumnya sudah belajar atau mencoba membuat beberapa project? kalau sudah ceritakan pengalamanmu!</label>
                      <textarea name="projectExperience" value={formData.projectExperience} onChange={handleInputChange} rows={3} className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
                    </div>

                    {formStatus && (
                      <div className="text-center p-3 bg-white/5 rounded-lg text-primary font-medium text-sm">
                        {formStatus}
                      </div>
                    )}

                    {errorMsg && (
                      <div className="text-center p-3 bg-error/20 border border-error/50 rounded-lg text-error font-medium text-sm mb-2">
                        {errorMsg}
                      </div>
                    )}
                    <div className="flex justify-between mt-4">
                      <button type="button" onClick={() => setModalStep(1)} disabled={isSubmitting} className="px-6 py-3 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50">
                        Kembali
                      </button>
                      <button type="submit" disabled={isSubmitting} className="btn-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg border-none cursor-pointer flex items-center gap-2 hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:transform-none">
                        {isSubmitting ? "Mengirim..." : "Kirim Formulir"}
                      </button>
                    </div>
                  </form>
                )}

                {modalStep === 3 && (
                  <div className="text-center py-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h3 className="font-display-lg text-2xl mb-4 text-white">Terima Kasih!</h3>
                    <p className="text-on-surface-variant mb-8 max-w-md">
                      Data pendaftaran Anda telah berhasil dikirim ke sistem kami. Silakan hubungi narahubung di bawah ini untuk informasi lebih lanjut.
                    </p>

                    <div className="glass-panel p-6 rounded-2xl w-full max-w-sm text-left border border-primary/20">
                      <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Narahubung</p>
                      <p className="font-bold text-lg mb-1">Panji Athallah Ramadhan / XII-A1</p>
                      <p className="text-on-surface-variant flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-sm">chat</span> WA: +62 813-5890-9827
                      </p>
                      <p className="text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">send</span> Telegram: @panjiathallah
                      </p>
                    </div>

                    <button onClick={() => { setIsModalOpen(false); setModalStep(1); setFormData({ name: "", gender: "", classOrGugus: "", nis: "", telegram: "", whatsapp: "", reason: "", expectation: "", experience: "", commitment: "", infoSource: "", infoSourceOther: "", projectExperience: "" }); }} className="mt-8 px-8 py-3 bg-surface-container hover:bg-surface-container-high text-white rounded-xl transition-colors border border-white/10 cursor-pointer">
                      Tutup
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-surface-container-lowest border-t border-white/5 py-section-gap mt-section-gap">
        <div className="max-w-7xl mx-auto px-container-padding grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="md:col-span-1">
            <div className="font-display-lg text-headline-md font-bold text-primary mb-6">KKA Smanda</div>
            <p className="font-body-base text-body-base text-on-surface-variant mb-6">
              Koding & Kecerdasan Artifisal SMA Negeri 1 Pandaan. Menempa talenta digital masa depan dari bangku
              sekolah.
            </p>
            <div className="flex gap-4">
              <a
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">public</span>
              </a>
              <a
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary transition-all"
                href="#"
              >
                <span className="material-symbols-outlined">hub</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-label-sm text-label-sm font-bold text-primary mb-6 uppercase tracking-wider">
              Socials
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  className="text-on-surface-variant hover:text-on-surface transition-colors font-body-base"
                  href="https://www.instagram.com/kka.smanda"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="text-on-surface-variant hover:text-on-surface transition-colors font-body-base"
                  href="https://wa.me/6281358909827"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-container-padding pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-on-surface-variant font-label-sm text-label-sm opacity-60">
            © 2026 KKA Smanda. All rights reserved.
          </div>

          <div className="flex gap-6 text-on-surface-variant font-label-sm text-label-sm opacity-60">
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
