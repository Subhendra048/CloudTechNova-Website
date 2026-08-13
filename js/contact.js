document.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("message");
    const charCount = document.getElementById("charCount");
    const charHint = message?.closest("div")?.querySelector(".char-hint");
    const MAX_CHARS = 500;

    //Character counter
    if (message && charCount) {
        message.addEventListener("input", () => {
            const len = message.value.length;
            charCount.textContent = len;

            charHint.classList.remove("warn", "limit");
            if (len >= MAX_CHARS) {
                charHint.classList.add("limit");
            } else if (len >= MAX_CHARS * 0.9) {
                charHint.classList.add("warn");
            }
        });
    }

    //Field check
    const fullName = document.getElementById("fullName");
    const company = document.getElementById("company");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const country = document.getElementById("country");
    const serviceInterest = document.getElementById("serviceInterest");
    const consentCheckbox = document.getElementById("consentCheckbox");
    const submitBtn = document.getElementById("submitBtn");

    const requiredFields = [fullName, company, email, country, serviceInterest];

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function showError(field, msg) {
        clearError(field);
        const err = document.createElement("div");
        err.className = "field-error";
        err.textContent = msg;
        field.insertAdjacentElement("afterend", err);
        field.classList.add("input-error");
    }

    function clearError(field) {
        field.classList.remove("input-error");
        const next = field.nextElementSibling;
        if (next && next.classList.contains("field-error")) next.remove();
    }

    requiredFields.forEach(field => {
        if (!field) return;
        field.addEventListener("blur", () => {
            if (!field.value.trim()) {
                showError(field, "This field is required.");
            } else if (field === email && !isValidEmail(field.value)) {
                showError(field, "Enter a valid email address.");
            } else {
                clearError(field);
            }
        });
    });
   

    function showSuccessBanner() {
        const existing = document.querySelector(".success-banner");
        if (existing) existing.remove();

        const banner = document.createElement("div");
        banner.className = "success-banner";
        banner.innerHTML = `
            <span class="success-check">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="5 13 10 18 19 7"/>
                </svg>
            </span>
            <span>Message sent! We'll contact you within 24 hours.</span>
        `;

        submitBtn.insertAdjacentElement("afterend", banner);
        requestAnimationFrame(() => banner.classList.add("show"));

        setTimeout(() => {
            banner.classList.remove("show");
            setTimeout(() => banner.remove(), 300);
        }, 5000);
    }

    function showErrorBanner(msg) {
        const existing = document.querySelector(".success-banner");
        if (existing) existing.remove();

        const banner = document.createElement("div");
        banner.className = "success-banner"; // reuse same styling; style .error-banner separately if you want a different color
        banner.style.background = "#c0392b";
        banner.innerHTML = `<span>${msg}</span>`;

        submitBtn.insertAdjacentElement("afterend", banner);
        requestAnimationFrame(() => banner.classList.add("show"));

        setTimeout(() => {
            banner.classList.remove("show");
            setTimeout(() => banner.remove(), 300);
        }, 5000);
    }

   const contactForm = document.getElementById("contactForm");
         if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let valid = true;

            requiredFields.forEach(field => {
                if (!field) return;
                if (!field.value.trim()) {
                    showError(field, "This field is required.");
                    valid = false;
                } else if (field === email && !isValidEmail(field.value)) {
                    showError(field, "Enter a valid email address.");
                    valid = false;
                } else {
                    clearError(field);
                }
            });

            if (consentCheckbox && !consentCheckbox.checked) {
                valid = false;
                consentCheckbox.closest("label").classList.add("consent-error");
            } else if (consentCheckbox) {
                consentCheckbox.closest("label").classList.remove("consent-error");
            }

            if (!valid) return;

            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";

            //submission backend
            try {
                const response = await fetch("http://localhost:5000/send-message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: fullName.value,
                        company: company.value,
                        email: email.value,
                        phone: phone ? phone.value : "",
                        country: country.value,
                        serviceInterest: serviceInterest.value,
                        message: message.value
                    })
                });

                const result = await response.json();

                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Messages`;

                if (result.success) {
                    showSuccessBanner();
                    document.querySelectorAll(".form-card input, .form-card textarea, .form-card select").forEach(el => {
                        if (el.type === "checkbox") el.checked = false;
                        else el.value = "";
                    });
                    charCount.textContent = "0";
                } else {
                    showErrorBanner(result.error || "Something went wrong. Please try again.");
                }
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Send Messages`;
                showErrorBanner("Could not reach the server. Is the backend running?");
            }
        });
    }
});