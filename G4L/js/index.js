document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const desktopBreakpoint = window.matchMedia("(min-width: 821px)");
    let lockedScrollY = 0;

    const lockPageScroll = () => {
        if (document.body.classList.contains("nav-open")) return;
        lockedScrollY = window.scrollY || window.pageYOffset || 0;
        document.body.style.top = `-${lockedScrollY}px`;
        document.body.classList.add("nav-open");
    };

    const unlockPageScroll = () => {
        if (!document.body.classList.contains("nav-open")) return;
        document.body.classList.remove("nav-open");
        document.body.style.top = "";
        window.scrollTo(0, lockedScrollY);
    };

    const syncBodyState = () => {
        if (navMenu?.classList.contains("is-open")) {
            lockPageScroll();
        } else {
            unlockPageScroll();
        }
    };

    const syncMenuVisibility = () => {
        if (!navMenu) return;

        if (desktopBreakpoint.matches) {
            navMenu.classList.remove("is-open");
            if (navToggle) {
                navToggle.setAttribute("aria-expanded", "false");
            }
        }

        syncBodyState();
    };

    const closeMenu = () => {
        if (!navMenu || !navToggle || desktopBreakpoint.matches) return;
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
        syncBodyState();
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!isExpanded));
            navMenu.classList.toggle("is-open", !isExpanded);
            syncBodyState();
        });

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".site-header")) {
                closeMenu();
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        window.addEventListener("resize", syncMenuVisibility);
        syncMenuVisibility();
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach((link) => {
        const target = link.getAttribute("href")?.split("/").pop();
        if (target === currentPage) {
            link.classList.add("active");
        }
    });

    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = new Date().getFullYear();
    });
});
