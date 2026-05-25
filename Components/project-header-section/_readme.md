The project-header-section is used as an overview of the most-relevant data of a project. 
It is used in index.html for the featured projects, as well as the lightboxes of the project-cards in the further-projects-section. 

hot it works: 
1. use template-manager.js.createFragmentFromTemplate to get a copy of any project-header-section-template (default: project-header-section.html)
2. call project-header-section.js.initializeProjectHeaderSection, which does the following: 
   3. Validate the passed in header section is a HTMLElement or DocumentFragment (first function parameter)
   4. Find the project-data-json-file (second function parameter)
   5. use load-data-refs.js.loadDataRefs to parse any "[data-ref='...']" attribute in the header-section
   6. Call other functions to add additional features (such as a behind-the-scenes-button) to the project-header-section

Example at index.html & index.js
