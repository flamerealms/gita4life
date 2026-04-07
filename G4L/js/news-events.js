document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll("[data-category]");
    const newsletterForm = document.querySelector(".js-newsletter-form");
    const newsletterStatus = document.querySelector(".newsletter-status");
    const newsModal = document.querySelector("[data-news-modal]");
    const modalTitle = document.querySelector("[data-news-modal-title]");
    const modalTag = document.querySelector("[data-news-modal-tag]");
    const modalLabel = document.querySelector("[data-news-modal-label]");
    const modalSummary = document.querySelector("[data-news-modal-summary]");
    const modalBody = document.querySelector("[data-news-modal-body]");
    const modalAction = document.querySelector("[data-news-modal-action]");
    let lastFocusedCard = null;

    const closeModal = () => {
        if (!newsModal) return;
        newsModal.hidden = true;
        document.body.classList.remove("news-modal-open");
        if (lastFocusedCard) {
            lastFocusedCard.focus();
        }
    };

    const openModal = (card) => {
        if (!newsModal || !modalTitle || !modalTag || !modalLabel || !modalSummary || !modalBody || !modalAction) return;

        const paragraphs = (card.dataset.newsDetails || "")
            .split("||")
            .map((item) => item.trim())
            .filter(Boolean);

        modalTitle.textContent = card.dataset.newsTitle || "";
        modalTag.textContent = card.dataset.newsType || "";
        modalTag.className = `news-tag ${(card.dataset.newsType || "").toLowerCase()}`;
        modalLabel.textContent = card.dataset.newsLabel || "";
        modalSummary.textContent = card.dataset.newsSummary || "";
        modalBody.innerHTML = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
        modalAction.href = card.dataset.newsAction || "./contact.html";
        modalAction.textContent = card.dataset.newsActionLabel || "Learn more";

        lastFocusedCard = card;
        newsModal.hidden = false;
        document.body.classList.add("news-modal-open");
        requestAnimationFrame(() => {
            newsModal.querySelector(".news-modal-close")?.focus();
        });
    };

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter || "all";

            filterButtons.forEach((item) => {
                item.classList.toggle("is-active", item === button);
            });

            cards.forEach((card) => {
                const category = card.getAttribute("data-category");
                const shouldShow = filter === "all" || category === filter;
                card.hidden = !shouldShow;
            });
        });
    });

    cards.forEach((card) => {
        const trigger = card.querySelector(".btn");
        if (!trigger) return;

        trigger.setAttribute("aria-haspopup", "dialog");

        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            openModal(card);
        });
    });

    newsModal?.addEventListener("click", (event) => {
        if (event.target.closest("[data-news-close]")) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && newsModal && !newsModal.hidden) {
            closeModal();
        }
    });

    if (newsletterForm && newsletterStatus) {
        newsletterForm.addEventListener("submit", (event) => {
            event.preventDefault();
            newsletterStatus.textContent = "Thanks for subscribing. We will share future updates with you.";
            newsletterForm.reset();
        });
    }
});
