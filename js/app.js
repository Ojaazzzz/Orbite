/* =====================================================
   ORBITE — App logic
   Keranjang, pencarian, katalog, detail, checkout
   ===================================================== */

(function () {
    "use strict";

    const CART_KEY = "orbite_cart_v1";
    const FREE_SHIPPING_MIN = 1000000;
    const SHIPPING_COST = 50000;
    const MAX_QTY = 10;

    const PAYMENT_LABELS = {
        transfer: "Transfer Bank",
        card: "Kartu Kredit",
        cod: "Bayar di Tempat (COD)"
    };

    const SHIPPING_LABELS = {
        reguler: "Reguler (2–4 hari)",
        express: "Express (1–2 hari)"
    };

    /* ---------------------------------------------
       Utilitas
       --------------------------------------------- */
    function money(value) {
        return "Rp " + new Intl.NumberFormat("id-ID").format(Math.max(0, Math.round(value)));
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
        });
    }

    function currentPage() {
        const file = window.location.pathname.split("/").pop();
        return file || "index.html";
    }

    function setText(selector, value) {
        const el = document.querySelector(selector);
        if (el) el.textContent = value;
    }

    function setHidden(selector, hidden) {
        const el = document.querySelector(selector);
        if (el) el.hidden = hidden;
    }

    /* ---------------------------------------------
       Keranjang
       --------------------------------------------- */
    let cartCache = null;

    function itemKey(id, color, storage) {
        return [id, color || "-", storage || "-"].join("|");
    }

    function isValidItem(item) {
        return Boolean(
            item &&
            typeof item.id === "string" &&
            getProductById(item.id) &&
            Number.isFinite(Number(item.qty)) &&
            Number(item.qty) > 0
        );
    }

    function loadCart() {
        if (cartCache) return cartCache;
        try {
            const raw = localStorage.getItem(CART_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            cartCache = Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
        } catch (error) {
            cartCache = [];
        }
        return cartCache;
    }

    function persistCart(cart) {
        cartCache = cart;
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (error) {
            /* Penyimpanan tidak tersedia — keranjang tetap jalan di sesi ini. */
        }
        updateCartBadge();
        document.dispatchEvent(new CustomEvent("cart:change", { detail: { cart } }));
    }

    function unitPrice(item) {
        const product = getProductById(item.id);
        if (!product) return 0;
        let price = product.price;
        if (product.storage && item.storage) {
            const variant = product.storage.find((option) => option.label === item.storage);
            if (variant) price += variant.extra;
        }
        return price;
    }

    function cartCount(cart) {
        return (cart || loadCart()).reduce((total, item) => total + Number(item.qty), 0);
    }

    function cartSubtotal(cart) {
        return (cart || loadCart()).reduce((total, item) => total + unitPrice(item) * Number(item.qty), 0);
    }

    function addToCart(productId, options) {
        const product = getProductById(productId);
        if (!product) return;

        const opts = options || {};
        const color = opts.color || (product.colors && product.colors[0] ? product.colors[0].name : "");
        const storage = opts.storage || (product.storage && product.storage[0] ? product.storage[0].label : "");
        const qty = clamp(Number(opts.qty) || 1, 1, MAX_QTY);
        const key = itemKey(product.id, color, storage);

        const cart = loadCart().slice();
        const existing = cart.find((item) => item.key === key);

        if (existing) {
            existing.qty = clamp(Number(existing.qty) + qty, 1, MAX_QTY);
        } else {
            cart.push({ key, id: product.id, color, storage, qty });
        }

        persistCart(cart);
        showToast(product.name + " ditambahkan ke keranjang.");
    }

    function changeQty(key, delta) {
        const cart = loadCart().slice();
        const item = cart.find((entry) => entry.key === key);
        if (!item) return;

        item.qty = clamp(Number(item.qty) + delta, 1, MAX_QTY);
        persistCart(cart);
    }

    function removeFromCart(key) {
        const cart = loadCart().filter((entry) => entry.key !== key);
        persistCart(cart);
    }

    let lastBadgeTotal = null;

    function updateCartBadge() {
        const total = cartCount();
        document.querySelectorAll("[data-cart-count]").forEach((badge) => {
            badge.textContent = total > 99 ? "99+" : String(total);
            badge.classList.toggle("is-visible", total > 0);

            if (lastBadgeTotal !== null && total > lastBadgeTotal && total > 0) {
                badge.classList.remove("is-bumped");
                void badge.offsetWidth;
                badge.classList.add("is-bumped");
            }
        });
        lastBadgeTotal = total;
    }

    /* ---------------------------------------------
       Toast
       --------------------------------------------- */
    let toastTimer = null;

    function ensureToast() {
        let toast = document.getElementById("toast");
        if (toast) return toast;

        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
        document.body.appendChild(toast);
        return toast;
    }

    function showToast(message) {
        const toast = ensureToast();
        const label = toast.querySelector("span");
        if (label) label.textContent = message;

        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            toast.classList.remove("is-visible");
        }, 2600);
    }

    /* ---------------------------------------------
       Navigasi
       --------------------------------------------- */
    let menuOpen = false;
    let searchOpen = false;

    function syncBodyLock() {
        document.body.classList.toggle("is-locked", menuOpen || searchOpen);
    }

    function markActiveNav() {
        const page = currentPage();
        let active = "";

        if (page === "index.html") {
            active = "home";
        } else if (page === "products.html" || page === "product.html") {
            active = "products";
        } else if (page === "tentang.html") {
            active = "tentang";
        }

        document.querySelectorAll("[data-nav]").forEach((link) => {
            link.classList.toggle("is-active", link.dataset.nav === active);
        });
    }

    function initNav() {
        const toggle = document.querySelector(".menu-toggle");
        const menu = document.getElementById("mobileMenu");
        const nav = document.querySelector(".site-nav");

        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menuOpen = !menuOpen;
                toggle.classList.toggle("is-open", menuOpen);
                toggle.setAttribute("aria-expanded", String(menuOpen));
                menu.classList.toggle("is-open", menuOpen);
                syncBodyLock();
            });

            menu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", function () {
                    menuOpen = false;
                    toggle.classList.remove("is-open");
                    toggle.setAttribute("aria-expanded", "false");
                    menu.classList.remove("is-open");
                    syncBodyLock();
                });
            });
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menuOpen) {
                menuOpen = false;
                if (toggle) {
                    toggle.classList.remove("is-open");
                    toggle.setAttribute("aria-expanded", "false");
                }
                if (menu) menu.classList.remove("is-open");
                syncBodyLock();
            }
        });

        if (nav) {
            const onScroll = function () {
                nav.classList.toggle("is-scrolled", window.scrollY > 8);

                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
                nav.style.setProperty("--scroll-progress", progress.toFixed(4));
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);
            onScroll();
        }

        markActiveNav();
    }

    /* ---------------------------------------------
       Pencarian
       --------------------------------------------- */
    function initSearch() {
        const overlay = document.getElementById("searchOverlay");
        if (!overlay) return;

        const input = document.getElementById("searchInput");
        const results = document.getElementById("searchResults");
        const closeBtn = overlay.querySelector(".search-close");
        const openers = document.querySelectorAll("[data-search-open]");
        let lastFocus = null;

        function updateScrollHint() {
            if (!results) return;
            const panel = results.closest(".search-panel");
            if (!panel) return;
            const hasMore = results.scrollHeight - results.scrollTop - results.clientHeight > 4;
            panel.classList.toggle("has-more", hasMore);
            results.classList.toggle("can-scroll-up", results.scrollTop > 4);
        }

        function renderResults(query) {
            if (!results) return;
            results.innerHTML = "";

            const clean = query.trim();
            const needle = clean.toLowerCase();

            let items;
            let label;

            if (!needle) {
                items = PRODUCTS.filter((product) => product.featured).slice(0, 4);
                label = "Produk populer";
            } else {
                items = PRODUCTS.filter(function (product) {
                    const haystack = [
                        product.name,
                        product.tagline,
                        getCategoryLabel(product.category)
                    ].join(" ").toLowerCase();
                    return haystack.indexOf(needle) !== -1;
                }).slice(0, 6);
                label = items.length ? "Hasil pencarian" : "";
            }

            if (label) {
                const labelEl = document.createElement("p");
                labelEl.className = "search-label";
                labelEl.textContent = label;
                results.appendChild(labelEl);
            }

            if (!items.length) {
                const empty = document.createElement("p");
                empty.className = "search-empty";
                empty.textContent = 'Tidak ada produk yang cocok dengan "' + clean + '".';
                results.appendChild(empty);
            }

            items.forEach(function (product) {
                const link = document.createElement("a");
                link.className = "search-result";
                link.href = "product.html?id=" + encodeURIComponent(product.id);

                const img = document.createElement("img");
                img.src = product.image;
                img.alt = "";
                img.loading = "lazy";

                const info = document.createElement("div");
                info.className = "search-result-info";

                const name = document.createElement("div");
                name.className = "search-result-name";
                name.textContent = product.name;

                const meta = document.createElement("div");
                meta.className = "search-result-meta";
                meta.textContent = getCategoryLabel(product.category);

                info.appendChild(name);
                info.appendChild(meta);

                const price = document.createElement("div");
                price.className = "search-result-price";
                price.textContent = money(product.price);

                link.appendChild(img);
                link.appendChild(info);
                link.appendChild(price);
                link.addEventListener("click", close);

                results.appendChild(link);
            });

            if (needle) {
                const all = document.createElement("a");
                all.className = "search-all";
                all.href = "products.html?q=" + encodeURIComponent(clean);
                all.textContent = 'Lihat semua hasil untuk "' + clean + '"';
                results.appendChild(all);
            }

            window.requestAnimationFrame(updateScrollHint);
        }

        function open() {
            lastFocus = document.activeElement;
            searchOpen = true;
            overlay.classList.add("is-open");
            overlay.setAttribute("aria-hidden", "false");
            syncBodyLock();
            renderResults(input ? input.value : "");
            window.setTimeout(function () {
                if (input) input.focus();
            }, 60);
        }

        function close() {
            searchOpen = false;
            overlay.classList.remove("is-open");
            overlay.setAttribute("aria-hidden", "true");
            syncBodyLock();
            if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
        }

        openers.forEach(function (button) {
            button.addEventListener("click", open);
        });

        if (closeBtn) closeBtn.addEventListener("click", close);

        if (results) {
            results.addEventListener("scroll", updateScrollHint, { passive: true });
        }
        window.addEventListener("resize", updateScrollHint);

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) close();
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && searchOpen) close();
        });

        if (input) {
            input.addEventListener("input", function () {
                renderResults(input.value);
            });

            input.addEventListener("keydown", function (event) {
                if (event.key !== "Enter") return;
                const query = input.value.trim();
                if (!query) return;
                window.location.href = "products.html?q=" + encodeURIComponent(query);
            });
        }

        overlay.setAttribute("aria-hidden", "true");
    }

    /* ---------------------------------------------
       Kartu produk
       --------------------------------------------- */
    function productCardHTML(product, index) {
        const badge = product.badge
            ? '<span class="product-badge">' + product.badge + "</span>"
            : "";
        const cardIndex = Number.isInteger(index)
            ? ' style="--card-index:' + index + '"'
            : "";

        return [
            '<article class="product-card"' + cardIndex + ">",
            '  <a class="product-media" href="product.html?id=' + encodeURIComponent(product.id) + '" aria-label="Lihat ' + product.name + '">',
            '    <img src="' + product.image + '" alt="' + product.name + '" loading="lazy">',
            badge,
            "  </a>",
            '  <div class="product-body">',
            '    <p class="product-cat">' + getCategoryLabel(product.category) + "</p>",
            '    <h3 class="product-name"><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + product.name + "</a></h3>",
            '    <p class="product-tagline">' + product.tagline + "</p>",
            '    <div class="product-foot">',
            '      <p class="product-price">' + money(product.price) + "</p>",
            '      <button class="quick-add" type="button" data-add-id="' + product.id + '" aria-label="Tambah ' + product.name + ' ke keranjang">',
            '        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
            "      </button>",
            "    </div>",
            "  </div>",
            "</article>"
        ].join("");
    }

    function initQuickAdd() {
        document.addEventListener("click", function (event) {
            const button = event.target.closest("[data-add-id]");
            if (!button) return;
            event.preventDefault();
            addToCart(button.dataset.addId);
            button.classList.remove("is-added");
            void button.offsetWidth;
            button.classList.add("is-added");
            window.clearTimeout(button._addedTimer);
            button._addedTimer = window.setTimeout(function () {
                button.classList.remove("is-added");
            }, 900);
        });
    }

    /* ---------------------------------------------
       Beranda
       --------------------------------------------- */
    const CATEGORY_MEDIA = {
        iphone: "assets/img/iphone-18-pro.png",
        mac: "assets/img/macbook-air.jpg",
        ipad: "assets/img/ipad-air.jpg",
        watch: "assets/img/watch-series.jpg",
        audio: "assets/img/airpods-pro.jpg",
        aksesori: "assets/img/magic-keyboard.png"
    };

    function initHome() {
        const featuredGrid = document.getElementById("featuredGrid");
        if (featuredGrid) {
            featuredGrid.innerHTML = PRODUCTS
                .filter((product) => product.featured)
                .slice(0, 6)
                .map(function (product, index) {
                    return productCardHTML(product, index);
                })
                .join("");
        }

        const categoryList = document.getElementById("categoryList");
        if (categoryList) {
            categoryList.innerHTML = CATEGORIES.map(function (category) {
                const count = PRODUCTS.filter((product) => product.category === category.id).length;
                const media = CATEGORY_MEDIA[category.id] || "assets/img/iphone-16.jpg";
                return [
                    '<a class="orbit-node" href="products.html?category=' + category.id + '">',
                    '  <span class="orbit-node-media"><img src="' + media + '" alt="" loading="lazy"></span>',
                    '  <span class="orbit-node-label">' + category.label + "</span>",
                    '  <span class="orbit-node-count">' + count + " produk</span>",
                    "</a>"
                ].join("");
            }).join("");
        }
    }

    function initHeroSlider() {
        const hero = document.querySelector("[data-hero]");
        if (!hero) return;

        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const media = Array.from(hero.querySelectorAll("[data-hero-media]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        const counter = hero.querySelector("[data-hero-counter]");
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        const stage = hero.querySelector(".orbit-hero-stage");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (!slides.length) return;

        let index = 0;
        let timer = null;
        let paused = false;

        function setSlide(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                const active = i === index;
                slide.classList.toggle("is-active", active);
                slide.setAttribute("aria-hidden", String(!active));
                slide.inert = !active;
            });

            media.forEach(function (item, i) {
                const active = i === index;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-hidden", String(!active));
            });

            dots.forEach(function (dot, i) {
                const active = i === index;
                dot.classList.toggle("is-active", active);
                dot.setAttribute("aria-pressed", String(active));
            });

            if (counter) counter.textContent = String(index + 1).padStart(2, "0");
        }

        function stop() {
            window.clearInterval(timer);
            timer = null;
        }

        function start() {
            stop();
            if (paused || reduced.matches) return;
            timer = window.setInterval(function () {
                setSlide(index + 1);
            }, 6500);
        }

        function go(nextIndex, userInitiated) {
            setSlide(nextIndex);
            if (userInitiated) start();
        }

        if (prev) prev.addEventListener("click", function () { go(index - 1, true); });
        if (next) next.addEventListener("click", function () { go(index + 1, true); });

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                go(Number(dot.dataset.heroDot), true);
            });
        });

        hero.addEventListener("mouseenter", function () {
            paused = true;
            stop();
        });

        hero.addEventListener("mouseleave", function () {
            paused = false;
            start();
        });

        hero.addEventListener("focusin", function () {
            paused = true;
            stop();
        });

        hero.addEventListener("focusout", function (event) {
            if (!hero.contains(event.relatedTarget)) {
                paused = false;
                start();
            }
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) stop();
            else start();
        });

        hero.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                go(index - 1, true);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                go(index + 1, true);
            }
        });

        if (stage) {
            let startX = null;

            stage.addEventListener("pointerdown", function (event) {
                startX = event.clientX;
            });

            stage.addEventListener("pointerup", function (event) {
                if (startX === null) return;
                const delta = event.clientX - startX;
                startX = null;
                if (Math.abs(delta) > 40) {
                    go(index + (delta < 0 ? 1 : -1), true);
                }
            });

            stage.addEventListener("pointercancel", function () {
                startX = null;
            });
        }

        setSlide(0);
        start();
    }

    function initRails() {
        document.querySelectorAll("[data-rail-controls]").forEach(function (controls) {
            const rail = document.getElementById(controls.dataset.railControls);
            if (!rail) return;

            const prev = controls.querySelector("[data-rail-prev]");
            const next = controls.querySelector("[data-rail-next]");

            function step() {
                const card = rail.querySelector(".product-card");
                return card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
            }

            function sync() {
                const max = rail.scrollWidth - rail.clientWidth - 2;
                if (prev) prev.disabled = rail.scrollLeft <= 8;
                if (next) next.disabled = rail.scrollLeft >= max - 4;
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    rail.scrollBy({ left: -step(), behavior: "smooth" });
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    rail.scrollBy({ left: step(), behavior: "smooth" });
                });
            }

            rail.addEventListener("scroll", sync, { passive: true });
            window.addEventListener("resize", sync);
            sync();
        });
    }

    /* ---------------------------------------------
       Katalog
       --------------------------------------------- */
    function initCatalog() {
        const grid = document.getElementById("productGrid");
        if (!grid) return;

        const params = new URLSearchParams(window.location.search);
        const state = {
            category: params.get("category") || "all",
            q: params.get("q") || "",
            sort: params.get("sort") || "default"
        };

        const chips = document.querySelectorAll(".chip[data-filter]");
        const searchInput = document.getElementById("catalogSearch");
        const sortSelect = document.getElementById("sortSelect");
        const countEl = document.getElementById("resultCount");
        const resetBtns = document.querySelectorAll("[data-reset-filters]");
        const emptyState = document.getElementById("catalogEmpty");

        if (searchInput) searchInput.value = state.q;
        if (sortSelect) sortSelect.value = state.sort;

        function matchesSearch(product, needle) {
            const haystack = [
                product.name,
                product.tagline,
                getCategoryLabel(product.category)
            ].join(" ").toLowerCase();
            return haystack.indexOf(needle) !== -1;
        }

        function syncURL() {
            const next = new URLSearchParams();
            if (state.category !== "all") next.set("category", state.category);
            if (state.q) next.set("q", state.q);
            if (state.sort !== "default") next.set("sort", state.sort);

            const query = next.toString();
            const url = query ? "?" + query : window.location.pathname;

            try {
                window.history.replaceState(null, "", url);
            } catch (error) {
                /* Diabaikan pada lingkungan file:// tertentu. */
            }
        }

        function render() {
            let items = PRODUCTS.slice();
            const needle = state.q.trim().toLowerCase();

            if (state.category !== "all") {
                items = items.filter((product) => product.category === state.category);
            }

            if (needle) {
                items = items.filter((product) => matchesSearch(product, needle));
            }

            if (state.sort === "price-asc") {
                items.sort((a, b) => a.price - b.price);
            } else if (state.sort === "price-desc") {
                items.sort((a, b) => b.price - a.price);
            } else if (state.sort === "name") {
                items.sort((a, b) => a.name.localeCompare(b.name, "id"));
            }

            grid.innerHTML = items
                .map(function (product, index) {
                    return productCardHTML(product, index);
                })
                .join("");

            if (emptyState) emptyState.hidden = items.length > 0;

            if (countEl) {
                const queryNote = needle ? ' untuk "' + escapeHTML(state.q.trim()) + '"' : "";
                countEl.innerHTML = "Menampilkan <strong>" + items.length + "</strong> produk" + queryNote;
            }

            chips.forEach(function (chip) {
                const isActive = chip.dataset.filter === state.category;
                chip.classList.toggle("is-active", isActive);
                chip.setAttribute("aria-pressed", String(isActive));
            });

            const hasFilters = state.category !== "all" || Boolean(needle) || state.sort !== "default";
            resetBtns.forEach(function (button) {
                button.hidden = !hasFilters;
            });

            syncURL();
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                state.category = chip.dataset.filter;
                render();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                state.q = searchInput.value;
                render();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                state.sort = sortSelect.value;
                render();
            });
        }

        function resetFilters() {
            state.category = "all";
            state.q = "";
            state.sort = "default";
            if (searchInput) searchInput.value = "";
            if (sortSelect) sortSelect.value = "default";
            render();
        }

        resetBtns.forEach(function (button) {
            button.addEventListener("click", resetFilters);
        });

        render();
    }

    /* ---------------------------------------------
       Detail produk
       --------------------------------------------- */
    function initProductPage() {
        const root = document.getElementById("pdpRoot");
        if (!root) return;

        const params = new URLSearchParams(window.location.search);
        const product = getProductById(params.get("id"));
        const notFound = document.getElementById("pdpNotFound");

        if (!product) {
            root.hidden = true;
            if (notFound) notFound.hidden = false;
            return;
        }

        const selected = {
            color: product.colors && product.colors[0] ? product.colors[0].name : "",
            storage: product.storage && product.storage[0] ? product.storage[0].label : "",
            qty: 1
        };

        document.title = product.name + " — ORBITE";
        setText("#pdpCategory", getCategoryLabel(product.category));
        setText("#pdpTitle", product.name);
        setText("#pdpTagline", product.tagline);
        setText("#pdpDescription", product.description);
        setText("#pdpTax", "Termasuk PPN. Gratis pengiriman ke seluruh Indonesia.");

        const image = document.getElementById("pdpImage");
        if (image) {
            image.src = product.image;
            image.alt = product.name;
        }

        const badge = document.getElementById("pdpBadge");
        if (badge) {
            badge.textContent = product.badge || "";
            badge.hidden = !product.badge;
        }

        const breadcrumbCategory = document.getElementById("breadcrumbCategory");
        if (breadcrumbCategory) {
            breadcrumbCategory.textContent = getCategoryLabel(product.category);
            breadcrumbCategory.href = "products.html?category=" + product.category;
        }
        setText("#breadcrumbCurrent", product.name);

        const colorGroup = document.getElementById("colorGroup");
        const colorOptions = document.getElementById("colorOptions");
        const storageGroup = document.getElementById("storageGroup");
        const storageOptions = document.getElementById("storageOptions");
        const priceEl = document.getElementById("pdpPrice");
        const qtyValue = document.getElementById("qtyValue");
        const qtyMinus = document.getElementById("qtyMinus");
        const qtyPlus = document.getElementById("qtyPlus");

        function currentPrice() {
            let price = product.price;
            if (product.storage && selected.storage) {
                const variant = product.storage.find((option) => option.label === selected.storage);
                if (variant) price += variant.extra;
            }
            return price;
        }

        function refreshPrice() {
            if (priceEl) priceEl.textContent = money(currentPrice());
            setText("#colorValue", selected.color);
            setText("#storageValue", selected.storage);
        }

        function refreshQty() {
            if (qtyValue) qtyValue.textContent = String(selected.qty);
            if (qtyMinus) qtyMinus.disabled = selected.qty <= 1;
            if (qtyPlus) qtyPlus.disabled = selected.qty >= MAX_QTY;
        }

        if (colorGroup && colorOptions) {
            if (!product.colors || !product.colors.length) {
                colorGroup.hidden = true;
            } else {
                colorOptions.innerHTML = product.colors.map(function (color) {
                    return (
                        '<button type="button" class="swatch' + (color.name === selected.color ? " is-selected" : "") +
                        '" style="--swatch:' + color.hex + '" data-color="' + color.name +
                        '" aria-label="Warna ' + color.name + '" aria-pressed="' + (color.name === selected.color) + '"></button>'
                    );
                }).join("");

                colorOptions.addEventListener("click", function (event) {
                    const button = event.target.closest("[data-color]");
                    if (!button) return;
                    selected.color = button.dataset.color;
                    colorOptions.querySelectorAll(".swatch").forEach(function (swatch) {
                        const isActive = swatch.dataset.color === selected.color;
                        swatch.classList.toggle("is-selected", isActive);
                        swatch.setAttribute("aria-pressed", String(isActive));
                    });
                    refreshPrice();
                });
            }
        }

        if (storageGroup && storageOptions) {
            if (!product.storage || !product.storage.length) {
                storageGroup.hidden = true;
            } else {
                storageOptions.innerHTML = product.storage.map(function (option) {
                    return (
                        '<button type="button" class="storage-chip' + (option.label === selected.storage ? " is-selected" : "") +
                        '" data-storage="' + option.label + '" aria-pressed="' + (option.label === selected.storage) + '">' +
                        option.label + "</button>"
                    );
                }).join("");

                storageOptions.addEventListener("click", function (event) {
                    const button = event.target.closest("[data-storage]");
                    if (!button) return;
                    selected.storage = button.dataset.storage;
                    storageOptions.querySelectorAll(".storage-chip").forEach(function (chip) {
                        const isActive = chip.dataset.storage === selected.storage;
                        chip.classList.toggle("is-selected", isActive);
                        chip.setAttribute("aria-pressed", String(isActive));
                    });
                    refreshPrice();
                });
            }
        }

        if (qtyMinus) {
            qtyMinus.addEventListener("click", function () {
                selected.qty = clamp(selected.qty - 1, 1, MAX_QTY);
                refreshQty();
            });
        }

        if (qtyPlus) {
            qtyPlus.addEventListener("click", function () {
                selected.qty = clamp(selected.qty + 1, 1, MAX_QTY);
                refreshQty();
            });
        }

        const addButton = document.getElementById("addToCart");
        if (addButton) {
            addButton.addEventListener("click", function () {
                addToCart(product.id, {
                    color: selected.color,
                    storage: selected.storage,
                    qty: selected.qty
                });
            });
        }

        const buyButton = document.getElementById("buyNow");
        if (buyButton) {
            buyButton.addEventListener("click", function () {
                addToCart(product.id, {
                    color: selected.color,
                    storage: selected.storage,
                    qty: selected.qty
                });
                window.location.href = "checkout.html";
            });
        }

        const highlightList = document.getElementById("highlightList");
        if (highlightList) {
            highlightList.innerHTML = product.highlights.map(function (highlight) {
                return (
                    '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>' +
                    highlight + "</span></li>"
                );
            }).join("");
        }

        const specList = document.getElementById("specList");
        if (specList) {
            specList.innerHTML = product.specs.map(function (spec) {
                return (
                    '<div class="spec-row"><dt>' + spec.label + "</dt><dd>" + spec.value + "</dd></div>"
                );
            }).join("");
        }

        const relatedGrid = document.getElementById("relatedGrid");
        if (relatedGrid) {
            const sameCategory = PRODUCTS.filter(function (item) {
                return item.category === product.category && item.id !== product.id;
            });
            const others = PRODUCTS.filter(function (item) {
                return item.category !== product.category && item.id !== product.id;
            });
            const related = sameCategory.concat(others).slice(0, 4);
            relatedGrid.innerHTML = related
                .map(function (product, index) {
                    return productCardHTML(product, index);
                })
                .join("");
        }

        refreshPrice();
        refreshQty();
    }

    /* ---------------------------------------------
       Halaman keranjang
       --------------------------------------------- */
    function cartItemHTML(item) {
        const product = getProductById(item.id);
        if (!product) return "";

        const variant = [item.color, item.storage].filter(Boolean).join(", ");
        const lineTotal = unitPrice(item) * Number(item.qty);

        return [
            '<article class="cart-item" data-key="' + item.key + '">',
            '  <div class="cart-item-media">',
            '    <img src="' + product.image + '" alt="' + product.name + '">',
            "  </div>",
            '  <div class="cart-item-info">',
            '    <h3><a href="product.html?id=' + encodeURIComponent(product.id) + '">' + product.name + "</a></h3>",
            '    <p class="cart-item-variant">' + variant + "</p>",
            '    <div class="cart-item-controls">',
            '      <div class="qty">',
            '        <button type="button" data-cart-action="dec" data-key="' + item.key + '" aria-label="Kurangi jumlah ' + product.name + '">',
            '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
            "        </button>",
            "        <output>" + item.qty + "</output>",
            '        <button type="button" data-cart-action="inc" data-key="' + item.key + '" aria-label="Tambah jumlah ' + product.name + '">',
            '          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
            "        </button>",
            "      </div>",
            '      <button type="button" class="cart-remove" data-cart-action="remove" data-key="' + item.key + '">Hapus</button>',
            "    </div>",
            "  </div>",
            '  <p class="cart-item-total">' + money(lineTotal) + "</p>",
            "</article>"
        ].join("");
    }

    function initCartPage() {
        const list = document.getElementById("cartItems");
        if (!list) return;

        const layout = document.getElementById("cartLayout");
        const empty = document.getElementById("cartEmpty");
        const countEl = document.getElementById("cartItemCount");
        const subtotalEl = document.getElementById("summarySubtotal");
        const shippingEl = document.getElementById("summaryShipping");
        const totalEl = document.getElementById("summaryTotal");
        const progressFill = document.getElementById("progressFill");
        const progressText = document.getElementById("progressText");
        const recommendedGrid = document.getElementById("recommendedGrid");

        if (recommendedGrid) {
            recommendedGrid.innerHTML = PRODUCTS
                .filter((product) => product.featured)
                .slice(0, 4)
                .map(function (product, index) {
                    return productCardHTML(product, index);
                })
                .join("");
        }

        function render() {
            const cart = loadCart();
            const count = cartCount(cart);

            if (countEl) {
                countEl.textContent = count + " item";
            }

            if (!cart.length) {
                list.innerHTML = "";
                if (layout) layout.hidden = true;
                if (empty) empty.hidden = false;
                return;
            }

            if (layout) layout.hidden = false;
            if (empty) empty.hidden = true;

            list.innerHTML = cart.map(cartItemHTML).join("");

            const subtotal = cartSubtotal(cart);
            const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;

            if (subtotalEl) subtotalEl.textContent = money(subtotal);
            if (shippingEl) shippingEl.textContent = shipping === 0 ? "Gratis" : money(shipping);
            if (totalEl) totalEl.textContent = money(subtotal + shipping);

            if (progressFill && progressText) {
                const remaining = FREE_SHIPPING_MIN - subtotal;
                if (remaining > 0) {
                    progressText.textContent = "Belanja " + money(remaining) + " lagi untuk gratis pengiriman.";
                    progressFill.style.width = Math.min((subtotal / FREE_SHIPPING_MIN) * 100, 100) + "%";
                } else {
                    progressText.textContent = "Pengiriman gratis sudah aktif untuk pesanan ini.";
                    progressFill.style.width = "100%";
                }
            }
        }

        list.addEventListener("click", function (event) {
            const button = event.target.closest("[data-cart-action]");
            if (!button) return;

            const key = button.dataset.key;
            const action = button.dataset.cartAction;

            if (action === "inc") changeQty(key, 1);
            if (action === "dec") changeQty(key, -1);
            if (action === "remove") removeFromCart(key);
        });

        document.addEventListener("cart:change", render);
        render();
    }

    /* ---------------------------------------------
       Checkout
       --------------------------------------------- */
    function initCheckoutPage() {
        const form = document.getElementById("checkoutForm");
        if (!form) return;

        const layout = document.getElementById("checkoutLayout");
        const empty = document.getElementById("checkoutEmpty");
        const success = document.getElementById("checkoutSuccess");
        const summaryItems = document.getElementById("summaryItems");
        const subtotalEl = document.getElementById("checkoutSubtotal");
        const shippingEl = document.getElementById("checkoutShipping");
        const totalEl = document.getElementById("checkoutTotal");
        const cardFields = document.getElementById("cardFields");
        const submitBtn = document.getElementById("placeOrder");

        if (!loadCart().length) {
            if (layout) layout.hidden = true;
            if (empty) empty.hidden = false;
            return;
        }

        if (layout) layout.hidden = false;
        if (empty) empty.hidden = true;

        function selectedShipping() {
            const checked = form.querySelector('input[name="shipping"]:checked');
            return checked ? checked.value : "reguler";
        }

        function shippingCost() {
            return selectedShipping() === "express" ? SHIPPING_COST : 0;
        }

        function selectedPayment() {
            const checked = form.querySelector('input[name="payment"]:checked');
            return checked ? checked.value : "transfer";
        }

        function renderSummary() {
            const cart = loadCart();
            const subtotal = cartSubtotal(cart);
            const shipping = shippingCost();

            if (summaryItems) {
                summaryItems.innerHTML = cart.map(function (item) {
                    const product = getProductById(item.id);
                    if (!product) return "";
                    const variant = [item.color, item.storage].filter(Boolean).join(", ");
                    return [
                        '<div class="mini-item">',
                        '  <img src="' + product.image + '" alt="' + product.name + '">',
                        '  <div class="mini-item-info">',
                        '    <p class="mini-item-name">' + product.name + "</p>",
                        '    <p class="mini-item-meta">' + variant + " (" + item.qty + "x)</p>",
                        "  </div>",
                        '  <p class="mini-item-price">' + money(unitPrice(item) * Number(item.qty)) + "</p>",
                        "</div>"
                    ].join("");
                }).join("");
            }

            if (subtotalEl) subtotalEl.textContent = money(subtotal);
            if (shippingEl) shippingEl.textContent = shipping === 0 ? "Gratis" : money(shipping);
            if (totalEl) totalEl.textContent = money(subtotal + shipping);
        }

        form.querySelectorAll('input[name="shipping"]').forEach(function (radio) {
            radio.addEventListener("change", renderSummary);
        });

        form.querySelectorAll('input[name="payment"]').forEach(function (radio) {
            radio.addEventListener("change", function () {
                const isCard = radio.value === "card" && radio.checked;
                if (cardFields) cardFields.hidden = !isCard;
            });
        });

        /* Format kartu saat mengetik */
        const cardNumber = document.getElementById("cardNumber");
        if (cardNumber) {
            cardNumber.addEventListener("input", function () {
                const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
                cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
            });
        }

        const cardExpiry = document.getElementById("cardExpiry");
        if (cardExpiry) {
            cardExpiry.addEventListener("input", function () {
                let digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
                if (digits.length > 2) digits = digits.slice(0, 2) + "/" + digits.slice(2);
                cardExpiry.value = digits;
            });
        }

        const cardCvv = document.getElementById("cardCvv");
        if (cardCvv) {
            cardCvv.addEventListener("input", function () {
                cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 3);
            });
        }

        function setError(input, message) {
            if (!input) return false;
            const field = input.closest(".field");
            if (!field) return false;
            const error = field.querySelector(".field-error");
            const valid = !message;
            field.classList.toggle("has-error", !valid);
            input.setAttribute("aria-invalid", String(!valid));
            if (error) error.textContent = message || "";
            return valid;
        }

        const validators = {
            name: function (value) {
                return value.trim().length >= 3 ? "" : "Masukkan nama lengkap.";
            },
            email: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
                    ? ""
                    : "Masukkan alamat email yang valid.";
            },
            phone: function (value) {
                const digits = value.replace(/\D/g, "");
                return digits.length >= 9 && digits.length <= 15
                    ? ""
                    : "Masukkan nomor telepon yang valid.";
            },
            address: function (value) {
                return value.trim().length >= 10 ? "" : "Masukkan alamat lengkap.";
            },
            city: function (value) {
                return value.trim().length >= 3 ? "" : "Masukkan kota.";
            },
            province: function (value) {
                return value ? "" : "Pilih provinsi.";
            },
            postal: function (value) {
                return /^\d{5}$/.test(value.trim()) ? "" : "Masukkan kode pos 5 digit.";
            },
            cardNumber: function (value) {
                return value.replace(/\D/g, "").length === 16
                    ? ""
                    : "Masukkan 16 digit nomor kartu.";
            },
            cardExpiry: function (value) {
                const match = value.match(/^(\d{2})\/(\d{2})$/);
                if (!match) return "Gunakan format MM/YY.";
                const month = Number(match[1]);
                const year = 2000 + Number(match[2]);
                const now = new Date();
                const expiry = new Date(year, month, 1);
                if (month < 1 || month > 12) return "Bulan tidak valid.";
                if (expiry <= new Date(now.getFullYear(), now.getMonth(), 1)) return "Kartu sudah kedaluwarsa.";
                return "";
            },
            cardCvv: function (value) {
                return /^\d{3}$/.test(value) ? "" : "Masukkan 3 digit CVV.";
            }
        };

        const fieldIds = ["name", "email", "phone", "address", "city", "province", "postal"];

        fieldIds.forEach(function (id) {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener("input", function () {
                setError(input, "");
            });
            input.addEventListener("change", function () {
                setError(input, "");
            });
        });

        ["cardNumber", "cardExpiry", "cardCvv"].forEach(function (id) {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener("input", function () {
                setError(input, "");
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const inputs = {};
            fieldIds.concat(["cardNumber", "cardExpiry", "cardCvv"]).forEach(function (id) {
                inputs[id] = document.getElementById(id);
            });

            let firstInvalid = null;

            fieldIds.forEach(function (id) {
                const input = inputs[id];
                if (!input) return;
                const valid = setError(input, validators[id](input.value));
                if (!valid && !firstInvalid) firstInvalid = input;
            });

            if (selectedPayment() === "card") {
                ["cardNumber", "cardExpiry", "cardCvv"].forEach(function (id) {
                    const input = inputs[id];
                    if (!input) return;
                    const valid = setError(input, validators[id](input.value));
                    if (!valid && !firstInvalid) firstInvalid = input;
                });
            }

            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            const order = {
                number: "ORB-" + String(Math.floor(100000 + Math.random() * 900000)),
                name: inputs.name ? inputs.name.value.trim() : "",
                email: inputs.email ? inputs.email.value.trim() : "",
                total: cartSubtotal(loadCart()) + shippingCost(),
                shipping: SHIPPING_LABELS[selectedShipping()],
                payment: PAYMENT_LABELS[selectedPayment()]
            };

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Memproses pesanan...";
            }

            window.setTimeout(function () {
                if (layout) layout.hidden = true;
                if (success) success.hidden = false;

                setText("#successOrderNumber", "Nomor pesanan " + order.number);
                setText("#successMessage", "Terima kasih, " + order.name + ". Konfirmasi pesanan dikirim ke " + order.email + ".");
                setText("#successShipping", order.shipping);
                setText("#successPayment", order.payment);
                setText("#successTotal", money(order.total));

                persistCart([]);
                document.title = "Pesanan diterima — ORBITE";
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 1400);
        });

        renderSummary();
    }

    /* ---------------------------------------------
       Sinkronisasi antar tab
       --------------------------------------------- */
    function initStorageSync() {
        window.addEventListener("storage", function (event) {
            if (event.key !== CART_KEY) return;
            cartCache = null;
            updateCartBadge();
            document.dispatchEvent(new CustomEvent("cart:change"));
        });
    }

    /* ---------------------------------------------
       Reveal saat masuk viewport
       --------------------------------------------- */
    function initReveals() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!("IntersectionObserver" in window)) return;

        const targets = document.querySelectorAll([
            ".page-head",
            ".page-title",
            ".section-head",
            ".intro-statement",
            ".intro-side",
            ".product-rail",
            ".duo-card",
            ".mission-card",
            ".about-teaser-inner",
            ".try-card",
            ".process-list li",
            ".disclaimer-card",
            ".about-card",
            ".about-story-grid > *",
            ".about-tech-grid > *",
            ".catalog-toolbar",
            ".product-grid",
            ".pdp-grid",
            ".pdp-section",
            ".related",
            ".recommended",
            ".checkout-card",
            ".success-card"
        ].join(","));

        if (!targets.length) return;

        const viewport = window.innerHeight;
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

        targets.forEach(function (el) {
            el.classList.add("reveal");
            const rect = el.getBoundingClientRect();
            if (rect.top < viewport * 0.94 && rect.bottom > 0) {
                el.classList.add("is-visible");
            } else {
                observer.observe(el);
            }
        });
    }

    /* ---------------------------------------------
       Start
       --------------------------------------------- */
    function init() {
        initNav();
        initSearch();
        initQuickAdd();
        initHome();
        initHeroSlider();
        initRails();
        initCatalog();
        initProductPage();
        initCartPage();
        initCheckoutPage();
        initStorageSync();
        updateCartBadge();
        initReveals();

        document.querySelectorAll("[data-year]").forEach(function (el) {
            el.textContent = String(new Date().getFullYear());
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
