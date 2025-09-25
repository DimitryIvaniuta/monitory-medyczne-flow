(() => {
    const isFileProtocol = location.protocol === "file:";
    if (isFileProtocol) {
        console.warn(
            "[include-partials] This page is opened via file://. " +
            "Browsers block fetching local files. Please run an HTTP server."
        );
        return;
    }

    async function inject(el) {
        const url = el.getAttribute("data-include");
        if (!url) return;

        try {
            const res = await fetch(url, { credentials: "same-origin" });
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            const html = await res.text();
            // Replace the placeholder with the fetched HTML
            el.outerHTML = html;
        } catch (err) {
            console.error(`[include-partials] Failed for ${url}:`, err);
        }
    }

    window.addEventListener("DOMContentLoaded", () => {
        const nodes = Array.from(document.querySelectorAll("[data-include]"));
        nodes.forEach(inject);
    });
})();
