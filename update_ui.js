const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Add errorMsg state
page = page.replace(
  'const [isSubmitting, setIsSubmitting] = useState(false);',
  'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [errorMsg, setErrorMsg] = useState("");'
);

// Clear error on input change
page = page.replace(
  'setFormData((prev) => ({ ...prev, [name]: value }));',
  'setFormData((prev) => ({ ...prev, [name]: value }));\n    if(errorMsg) setErrorMsg("");'
);

// 2. Change alerts to setErrorMsg
page = page.replace(
  'alert("Harap lengkapi semua kolom wajib di Tahap 1!");',
  'setErrorMsg("Harap lengkapi semua kolom wajib!");'
);
page = page.replace(
  'alert("Harap lengkapi semua kolom wajib di Tahap 2!");',
  'setErrorMsg("Harap lengkapi semua kolom wajib!");'
);

// Reset error when moving next step
page = page.replace(
  'setModalStep(2);',
  'setErrorMsg("");\n    setModalStep(2);'
);

// 3. Change "Tahap 1" to "Page 1"
page = page.replace(
  '{modalStep === 1 && "Form Pendaftaran - Tahap 1"}',
  '{modalStep === 1 && "Form Pendaftaran - Page 1"}'
);
page = page.replace(
  '{modalStep === 2 && "Form Pendaftaran - Tahap 2"}',
  '{modalStep === 2 && "Form Pendaftaran - Page 2"}'
);

// 4. Update Kelas/Gugus field
const oldClass = `<div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Kelas/Gugus <span className="text-error">*</span></label>
                    <input type="text" name="classOrGugus" value={formData.classOrGugus} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors" placeholder="Contoh: X-1, XI-F1" />
                  </div>`;
const newClass = `<div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Kelas/Gugus <span className="text-error">*</span></label>
                    <select name="classOrGugus" value={formData.classOrGugus} onChange={handleInputChange} required className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors">
                      <option value="">Pilih Kelas/Gugus</option>
                      {["Papaiya", "Lavanya", "Brassica", "Amrata", "Sativa", "Manira", "Kalpika", "Granata", "Nucera", "Pallava", "Artora", "Mawala", "XI-A1", "XI-A2", "XI-A3", "XI-A4", "XI-B1", "XI-B2", "XI-C", "XI-D", "XI-E1", "XI-E2", "XI-F1", "XI-F2"].map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>`;
page = page.replace(oldClass, newClass);

// 5. Update infoSource to radio buttons vertically
const oldInfo = `<div className="flex flex-col gap-2">
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
                  </div>`;
const newInfo = `<div className="flex flex-col gap-3">
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
                  </div>`;
page = page.replace(oldInfo, newInfo);

// 6. Inject error message display in Step 1
const step1End = `<div className="flex justify-end mt-4">`;
const step1EndWithErr = `{errorMsg && (
                    <div className="text-center p-3 bg-error/20 border border-error/50 rounded-lg text-error font-medium text-sm mb-2">
                      {errorMsg}
                    </div>
                  )}
                  <div className="flex justify-end mt-4">`;
page = page.replace(step1End, step1EndWithErr);

// 7. Inject error message display in Step 2 (replace existing formStatus if we can, or just add it)
const step2End = `<div className="flex justify-between mt-4">`;
const step2EndWithErr = `{errorMsg && (
                    <div className="text-center p-3 bg-error/20 border border-error/50 rounded-lg text-error font-medium text-sm mb-2">
                      {errorMsg}
                    </div>
                  )}
                  <div className="flex justify-between mt-4">`;
page = page.replace(step2End, step2EndWithErr);


fs.writeFileSync('src/app/page.tsx', page);
console.log("Updated UI!");
