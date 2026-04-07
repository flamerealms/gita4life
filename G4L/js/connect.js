document.addEventListener("DOMContentLoaded", () => {
    const CONTACT_EMAIL = "bhatthimanshu676@gmail.com";
    const EMAILJS_CONFIG = {
        publicKey: "JWTlQfyWC05ds7uhv",
        serviceId: "service_8f7gvz3",
        templateId: "template_1jmjdnm"
    };

    const forms = document.querySelectorAll(".js-contact-form");
    if (!forms.length) return;

    const canUseEmailJs =
        typeof window.emailjs !== "undefined" &&
        EMAILJS_CONFIG.publicKey &&
        EMAILJS_CONFIG.serviceId &&
        EMAILJS_CONFIG.templateId;

    if (canUseEmailJs) {
        try {
            window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
        } catch (error) {
            console.warn("EmailJS initialization failed.", error);
        }
    }

    const setStatus = (form, message, isError = false) => {
        const status = form.querySelector(".form-status");
        if (!status) return;
        status.textContent = message;
        status.classList.toggle("is-error", isError);
    };

    const serializeForm = (form) => {
        const formData = new FormData(form);
        return {
            name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            subject: String(formData.get("subject") || "").trim(),
            message: String(formData.get("message") || "").trim(),
            context: form.dataset.formContext || "Website enquiry"
        };
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const openMailClient = (payload) => {
        const subject = payload.subject || `${payload.context} from ${payload.name}`;
        const bodyLines = [
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            payload.phone ? `Phone: ${payload.phone}` : "",
            `Context: ${payload.context}`,
            "",
            payload.message
        ].filter(Boolean);

        const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
        window.location.href = mailtoUrl;
    };

    forms.forEach((form) => {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const payload = serializeForm(form);

            if (!payload.name || !payload.email || !payload.message) {
                setStatus(form, "Please complete your name, email, and message.", true);
                return;
            }

            if (!isValidEmail(payload.email)) {
                setStatus(form, "Please enter a valid email address.", true);
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalLabel = submitButton ? submitButton.textContent : "";
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            try {
                if (canUseEmailJs) {
                    await window.emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
                        from_name: payload.name,
                        from_email: payload.email,
                        phone_number: payload.phone || "Not provided",
                        subject: payload.subject || payload.context,
                        message: payload.message,
                        reply_to: payload.email,
                        context: payload.context
                    });

                    setStatus(form, "Message sent successfully. We will get back to you soon.");
                } else {
                    openMailClient(payload);
                    setStatus(form, "Your mail app has been opened so you can send the message directly.");
                }

                form.reset();
            } catch (error) {
                console.error("Contact form submission failed.", error);
                setStatus(form, "We could not send the message automatically. Your mail app will open instead.", true);
                openMailClient(payload);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalLabel;
                }
            }
        });
    });
});
