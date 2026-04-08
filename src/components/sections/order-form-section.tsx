import { useState } from "react"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

const SERVICES = [
  "Журнал / брошюра",
  "Постер / плакат",
  "Визитки",
  "Рекламный макет",
  "Коллаж из фото",
  "Другое",
]

export function OrderFormSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("https://functions.poehali.dev/549f5ec6-dc06-4c8e-858a-ad123fade41b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus("success")
        setForm({ name: "", phone: "", email: "", service: "", message: "" })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section className="bg-secondary px-6 py-24" id="order">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm uppercase tracking-widest mb-4">Заказать</p>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground">Расскажите о вашем проекте</h2>
          <p className="text-muted-foreground mt-4">Опишите задачу — свяжемся и обсудим детали.</p>
        </motion.div>

        {status === "success" ? (
          <motion.div
            className="bg-background rounded-2xl p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={32} className="text-primary" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">Заявка отправлена!</h3>
            <p className="text-muted-foreground">Мы получили ваш запрос и свяжемся с вами в ближайшее время.</p>
            <button
              className="mt-8 text-sm text-primary underline underline-offset-4"
              onClick={() => setStatus("idle")}
            >
              Отправить ещё одну заявку
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-background rounded-2xl p-8 md:p-10 space-y-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Ваше имя *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Иван Иванов"
                  className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+7 (900) 000-00-00"
                  className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Услуга</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Выберите услугу</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Расскажите о задаче</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Опишите что нужно сделать, размеры, тираж, пожелания..."
                className="w-full bg-secondary border-0 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                Не удалось отправить. Попробуйте ещё раз или напишите нам напрямую.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary text-primary-foreground rounded-xl py-4 font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Отправляем...
                </>
              ) : (
                <>
                  Отправить заявку
                  <Icon name="ArrowRight" size={18} />
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
