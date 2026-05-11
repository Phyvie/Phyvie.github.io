1. Create a script rotations.js and add it to Rotations.html and a script Moebius_magnus.js and add it to Moebius_magnus.html
2. Inside the new javascripts, call the CreateMiniatureScrollContainer()-function for each scroll-container in Rotations.html and Moebius_magnus.html (=for-loop with manually defined correspondingly
3. refactor the function CreateMiniatureScrollContainer() inside scroll-container.js to do the following: 
   - Create the miniature element
   - Write a function that: 
      - For each scroll-container__item clone the described-item and remove the description
      - Give the new element the class described-item__miniature
      - Append the new element to the scroll-container__miniature
4. Add each scroll-container__miniature to the DOM above the scroll-container
5. Create a new Wrapper for the scroll-container and scroll-container__content-container and add them both to the new wrapper