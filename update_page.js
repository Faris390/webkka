const fs = require('fs');

let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add new states
const oldStates = `  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);`;

const newStates = `  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.gender || !formData.classOrGugus || !formData.nis || !formData.telegram || !formData.whatsapp) {
      alert("Harap lengkapi semua kolom wajib di Tahap 1!");
      return;
    }
    setModalStep(2);
  };`;

page = page.replace(oldStates, newStates);

// 2. Replace handleJoinSubmit
const oldSubmitRegex = /  const handleJoinSubmit = async \([\s\S]*?  };/m;
const newSubmit = `  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.reason || !formData.experience || !formData.commitment || !formData.infoSource) {
      alert("Harap lengkapi semua kolom wajib di Tahap 2!");
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
        setModalStep(3); // Success Screen
      } else {
        setFormStatus("Gagal mengirim data. Silakan coba lagi.");
      }
    } catch (err) {
      setFormStatus("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };`;
page = page.replace(oldSubmitRegex, newSubmit);

// 3. Replace Nav link
page = page.replace(
  /<a\n\s+className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-colors"\n\s+href="#join-form"\n\s+>\n\s+Join Us\n\s+<\/a>/g,
  `<button
              className="text-on-surface-variant font-body-base text-body-base hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Join Us
            </button>`
);

// 4. Replace Hero link
const oldHeroLink = `<a
              href="#join-form"
              className="btn-primary text-white font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Gabung Sekarang
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
            </a>`;
const newHeroLink = `<button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-white font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2 relative overflow-hidden group cursor-pointer border-none"
            >
              <span className="relative z-10 flex items-center gap-2">
                Gabung Sekarang
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </span>
            </button>`;
page = page.replace(oldHeroLink, newHeroLink);

// 5. Replace Old Section and insert Modal
const oldSectionRegex = /        {\/\* REGISTRATION FORM - NATIVE BACKEND \*\/}[\s\S]*?<\/section>/m;
const newSectionAndModal = `
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => { if(modalStep !== 3 && !isSubmitting) setIsModalOpen(false) }}
          ></div>
          
          <div className="relative bg-surface border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-low">
              <h3 className="font-display-lg text-xl font-bold text-primary">
                {modalStep === 1 && "Form Pendaftaran - Tahap 1"}
                {modalStep === 2 && "Form Pendaftaran - Tahap 2"}
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
                    <input type="text" name="classOrGugus" value={formData.classOrGugus} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="Contoh: X-1, XI-F1" />
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
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Tahu informasi OPREC klub mapel dari mana? <span className="text-error">*</span></label>
                    <select name="infoSource" value={formData.infoSource} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                      <option value="">Pilih Sumber</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Stand Klub Mapel">Stand Klub Mapel</option>
                      <option value="Teman">Teman</option>
                      <option value="Kakak Kelas">Kakak Kelas</option>
                      <option value="Other">Other</option>
                    </select>
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
                  
                  <button onClick={() => { setIsModalOpen(false); setModalStep(1); setFormData({name: "", gender: "", classOrGugus: "", nis: "", telegram: "", whatsapp: "", reason: "", expectation: "", experience: "", commitment: "", infoSource: "", infoSourceOther: "", projectExperience: ""}); }} className="mt-8 px-8 py-3 bg-surface-container hover:bg-surface-container-high text-white rounded-xl transition-colors border border-white/10 cursor-pointer">
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;
page = page.replace(oldSectionRegex, newSectionAndModal);

fs.writeFileSync('src/app/page.tsx', page);
console.log("Updated page.tsx!");
