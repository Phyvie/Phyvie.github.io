# Portfolio - Valentin Then Bergh
## Technical Game Designer

[🚀 **View Live Portfolio**](https://phyvie.github.io/)

This repository contains the source code for my personal portfolio website, designed to showcase my work in game design and gameplay programming.

---

### 🛠 Technical Stack
*   **Languages:** HTML5, CSS (BEM methodology), JavaScript (ES6+)
*   **Libraries:** [highlight.js](https://highlightjs.org/) (for code syntax highlighting)
*   **Used Tools:** Git, WebStorm

Disclaimer: Parts of the website are written with the help of WebStorms Junie-AI, but are fully planned, reviewed, adjusted and tested by me.  

---

### ✨ Key Features
*   **Modular Component System:** Reusable UI element (cards, tooltips, lightboxes), which are mostly self-contained, they typically only require reset.css and global_variables.css. 
*   **Data-Driven Architecture:** Project details are loaded dynamically from JSON files via a custom `data-ref` system. 
*   **Custom Lightbox & Tooltips:** Built from scratch to maintain a lightweight, dependency-free codebase.
*   **Unity WebGL Integration:** A dedicated system to inject iframes-templates and data of WebGL build independently. 
*   **Responsive Design:** Fully optimized for mobile and desktop viewing. (Tested on Desktop in Chrome and Firefox)

### Projects: 
Page-/Project-specific stylesheets, javascripts and json-data are stored in folder of the corresponding Project (for the homepage that is the Index-folder).
If you want to use them, contact me via the e-mail on the homepage (on 25.05.2026: valentin.thenbergh@online.de)

Further projects can be added with the following steps: 
1. Store the data in a new subfolder in the Projects folder
2. Copy the _template_project_data.json file into the new subfolder and fill in the data
3. Add the project to the places it should appear on; e.g. to index.js if it should be on the main-page, or create a new .html-file if it has its own page or add it as project-card to the gallery via further-projects-section.js