/**
 * Advanced Exploit Search & Filter System
 * 
 * Features:
 * - Pre-indexed data for O(n) performance
 * - Real-time filtering with debounce
 * - Robust version/term matching logic
 * - Accessibility support
 */
class ExploitFilter {
    constructor(config = {}) {
        // Configuration with defaults
        this.cfg = {
            containerId: "ExploitSearchContainer",
            formId: "ExploitSearch-Form",
            itemSelector: "details",
            metaTagSelector: "searchi", // Keeping your custom tag
            inputClass: "esterm",
            debugParam: "dev",
            forceVisible: true, // Replaces the "|| true" hardcoding
            debounceTime: 300,
            ...config
        };

        this.container = document.getElementById(this.cfg.containerId);
        this.form = document.getElementById(this.cfg.formId);
        this.itemsIndex = []; // Cache for search data

        if (!this.container || !this.form) {
            console.warn("ExploitFilter: Container or Form not found.");
            return;
        }

        this.init();
    }

    init() {
        this.handleVisibility();
        this.indexItems();
        this.bindEvents();
        
        // Optional: Run filter once on load to set initial state
        // this.applyFilter(); 
    }

    /**
     * Determines if the search container should be shown based on URL or config
     */
    handleVisibility() {
        const urlParams = new URLSearchParams(window.location.search);
        const isDev = urlParams.has(this.cfg.debugParam);
        
        if (isDev || this.cfg.forceVisible) {
            this.container.style.display = "block";
            // Set semantic attribute
            this.container.setAttribute("aria-hidden", "false");
        } else {
            this.container.style.display = "none";
            this.container.setAttribute("aria-hidden", "true");
        }
    }

    /**
     * Scans the DOM once and creates an in-memory index of all items.
     * drastically improves performance over querying the DOM on every search.
     */
    indexItems() {
        const elements = document.querySelectorAll(this.cfg.itemSelector);
        
        this.itemsIndex = Array.from(elements).map(el => {
            const searchTags = Array.from(el.querySelectorAll(this.cfg.metaTagSelector));
            
            // If no search tags, this item is considered "always visible" or "uncategorized"
            // dependent on logic. Here we flag it.
            if (searchTags.length === 0) {
                return { element: el, isEmpty: true, versions: [], terms: [] };
            }

            // Extract all requirements from all <searchi> tags inside the details
            let versions = new Set();
            let terms = new Set();

            searchTags.forEach(tag => {
                const content = tag.textContent || "";
                const parts = content.split(";").map(s => s.trim()).filter(s => s.length > 0);

                parts.forEach(part => {
                    // Check if strictly numeric
                    if (!isNaN(part) && !isNaN(parseFloat(part))) {
                        versions.add(parseFloat(part)); // Use float to support 9.00 vs 9
                    } else {
                        terms.add(part.toLowerCase()); // Normalize to lowercase
                    }
                });
            });

            return {
                element: el,
                isEmpty: false,
                versions: Array.from(versions),
                terms: Array.from(terms)
            };
        });
        
        console.log(`Indexed ${this.itemsIndex.length} items for search.`);
    }

    bindEvents() {
        // Prevent form submission reload
        this.form.addEventListener("submit", (ev) => {
            ev.preventDefault();
            this.applyFilter();
        });

        // Real-time filtering with Debounce
        let timeout;
        this.form.addEventListener("input", () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.applyFilter(), this.cfg.debounceTime);
        });
        
        // Handle checkboxes specifically (change event bubbles)
        this.form.addEventListener("change", () => {
             clearTimeout(timeout);
             timeout = setTimeout(() => this.applyFilter(), this.cfg.debounceTime);
        });
    }

    /**
     * Core Logic: Reads inputs and toggles visibility of indexed items
     */
    applyFilter() {
        // 1. Capture User Inputs
        const inputs = Array.from(this.form.querySelectorAll(`.${this.cfg.inputClass}:checked`));
        
        const selectedVersions = inputs
            .filter(i => !isNaN(i.getAttribute("esterm-value")))
            .map(i => parseFloat(i.getAttribute("esterm-value")));

        const selectedTerms = inputs
            .filter(i => isNaN(i.getAttribute("esterm-value")))
            .map(i => i.getAttribute("esterm-value").toLowerCase());

        // Debug logging (optional)
        // console.debug("Filtering:", { selectedVersions, selectedTerms });

        let matchCount = 0;

        // 2. Iterate through cached index (Fast)
        this.itemsIndex.forEach(item => {
            if (item.isEmpty) {
                // If item has no tags, show it? (Preserving original logic: 'searchi-s nuts' -> block)
                this.toggleItem(item.element, true);
                matchCount++;
                return;
            }

            // Logic A: Version Matching
            // Original logic: "req <= v". 
            // Meaning: If selected version is 9.00, it matches requirements 5.05, 9.00, etc.
            let versionMatch = false;
            
            // If no versions selected, do we show all? 
            // The original code implies if `selectedVersions` is empty, `.some` returns false.
            // We'll stick to that strict logic.
            if (selectedVersions.length > 0 && item.versions.length > 0) {
                 versionMatch = item.versions.some(reqVer => 
                    selectedVersions.some(selVer => reqVer <= selVer)
                 );
            } else if (selectedVersions.length === 0 && item.versions.length === 0) {
                // Edge case: No version requirements and no version selected
                versionMatch = true; 
            } else if (selectedVersions.length === 0) {
                 // User selected nothing, but item has requirements. 
                 // Usually implies "don't show" in strict filters, or "show all" in loose.
                 // Original code: selectedVersions is [], .some returns false. We keep strict.
                 versionMatch = false;
            }

            // Logic B: Term Matching
            let termMatch = false;
            if (selectedTerms.length > 0) {
                termMatch = item.terms.some(reqTerm => selectedTerms.includes(reqTerm));
            } else {
                // If user selected NO terms, but selected versions, do we ignore terms?
                // The original code: `generalMatch` requires `otherSearchTerms.includes`.
                // If `otherSearchTerms` is empty, `generalMatch` is false.
                // However, usually filters are additive. 
                // Fix: If NO terms are selected in the form, treat termMatch as passed (neutral).
                // *Adjust this based on preference. I will make it 'Neutral if empty'*
                termMatch = selectedTerms.length === 0; 
            }
            
            // Refined Logic based on original code strictly requiring both:
            // Original: `if (versionMatch && generalMatch)`
            // This implies you MUST select a term AND a version for anything to show.
            // That is often bad UX. I will implement: 
            // Show if (Version Match OR No Version Selected) AND (Term Match OR No Term Selected)
            // BUT, if the form is completely empty, usually we show everything or nothing.
            
            // Let's stick closer to your original intention but fixed:
            // "Show item if it matches ANY selected version AND matches ANY selected term"
            
            // Re-evaluating original specific logic:
            // It required explicit matches. If you didn't check a box, it hid the item.
            const hasActiveVersionFilter = selectedVersions.length > 0;
            const hasActiveTermFilter = selectedTerms.length > 0;

            const vPass = hasActiveVersionFilter ? 
                          item.versions.some(req => selectedVersions.some(v => req <= v)) : 
                          true; // Pass if no filter active
            
            const tPass = hasActiveTermFilter ? 
                          item.terms.some(req => selectedTerms.includes(req)) : 
                          true; // Pass if no filter active

            // If absolutely nothing is checked, show everything (common directory behavior)
            // Or hide everything (search behavior).
            // Let's assume "Show All" if nothing checked.
            const isVisible = (!hasActiveVersionFilter && !hasActiveTermFilter) 
                              ? true 
                              : (vPass && tPass);

            this.toggleItem(item.element, isVisible);
            if (isVisible) matchCount++;
        });

        this.updateStatus(matchCount);
    }

    toggleItem(element, show) {
        if (show) {
            element.style.display = "block"; // Or use class 'active'
            element.removeAttribute("hidden");
        } else {
            element.style.display = "none";
            element.setAttribute("hidden", "until-found"); // Modern 'find in page' support
        }
    }
    
    updateStatus(count) {
        // Optional: Update a counter on the page
        // console.log(`Found ${count} matches`);
    }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    window.exploitSearch = new ExploitFilter({
        // You can override defaults here
        // forceVisible: false // Uncomment to rely strictly on ?dev
    });
});
