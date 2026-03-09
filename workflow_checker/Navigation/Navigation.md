## PHASE 1 - DEFINITION

### 1. XY-Chain:
- enable user quick navigation & content overview
==> this is not specific enough; should be more like: "problem: users cannot directly go from rotation-page to main-page or to CV -> solution: add navigation & content overview"

### 2. Description
| **input**                    | **behaviour** | **constraints**           | **output**                               |
|------------------------------|---------------|---------------------------|------------------------------------------|
| website content / user click | display       | not too much screen space | Content Overview & navigate to selection |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 3                  | 2            | medium     | 1 day       |

Begin-Time: 2026-06-03, 16:00
Finish-Time: 

-> switch (use-case * impact): 
- ~~<=3: brute-force <= 1h or backlog~~
- 4-6: acceptable solution <= 1day or backlog
- ~~\>=7: elegant solution~~

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ~~... is intellectually interesting?~~
- ... appears cool?  
- ~~... is fun to make?~~  
- ~~... helps an imaginary future?~~

###  Summary : 
No need for complex features like foldout-layering or double-navigation (for in-page & for external links), just built the simplest possible navigation. 
While it should not take up too much space & be simple to interact with, it should also be easy to implement. 

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - ~~**pre-built**: quick-check for reuse~~
 - ~~**similar**: similarity-table~~ 
 - **custom feature**: 
  - research <=min(0.5days, 3 answer) -> comparison table 
  - choose one and test <=(0.5day, acceptable test) -> result table
 - ~~**custom system**:~~

| solution             | advantage                                           | disadvantage |
|----------------------|-----------------------------------------------------|--------------|
| top-nav-bar          | more in-line with switching from website to website |              |
| side-nav-bar         | more in-line with switching within the site         |              |
| top-nav-with-foldout | in-line with switching from website to website      |              |
|                      |                                                     |              |

| tried solution                                                                    | advantage | disadvantage |
|-----------------------------------------------------------------------------------|-----------|--------------|
| W3schools.com/css/css_navbar                                                      |           |              |
|                                                                                   |           |              |
| https://thesyntaxdiaries.com/responsive-navbar-html-css-js                        |           |              |
|                                                                                   |           |              |
| https://www.codegenes.net/blog/how-to-apply-same-content-to-multiple-html-pages/  |           |              |
|                                                                                   |           |              |

### Research Summary: 
1. top-line nav-bar with a general foldout for smaller screens & foldout-layering for website-sections(see miro); 
2. create nav-bar file & use fetch (/the code I already have) to post the content onto each side.

### Happy-Path: 
- ~~**simple** (<= 1hour): pseudo-code lines~~
- **default** (<= 1day): flowchart & rubber-duck
- ~~**complex** (week): separate into tasks~~
- ~~**refactor**: check current documentation, goto corresponding case~~

### Kill Duck
- am I using this solution, only because it ...
- ~~... is intellectually interesting?~~
- ... appears cool?
- ~~... is fun to make?~~
- ... helps an imaginary future?
-> any yes = kill

### Happy-Path Summary:
=> I need to be careful not to waste time on the layered-foldouts. 

### Edge-Cases: 
- 5 min brainstorm (technical issues, user stupidity, internal curruption) into frequency-impact-time-list: 

| case | **frequency** | **impact** | solution-idea | **solve-time** | solve? |
|------|---------------|------------|---------------|----------------|--------|
|      |               |            |               |                |        |
|      |               |            |               |                |        |
|      |               |            |               |                |        |

### implement cases into Solution (from Happy-Path)

### Kill Duck: 
- implementable without further thinking?
- is it "boring"?
  - common patterns?
  - no surprises?
  - obvious error handling?
  - backwards-compatible?

###  Workflow: confirm solution design
### Solution Summary: 

# ________

## PHASE 3 - IMPLEMENTATION

### Happy-Path: 
- implement feature-documentation
- implement solution
- implement happy-path test
- compare with design

###  workflow: test success? continue!

### Edge-Cases: 
- implement edge-case-documentation
- implement edge-case test
- implement solution
    - parameterize if necessary
    - extract if necessary
    - rename new variables/functions
    - no structural changes (= no abstraction, no extra classes)

###  workflow: tests succeed? continue!
implementation mostly succesfull, except that the URLs are behaving weird again. It seems like Webstorms hosting is weird, because the files are somehow stored at localhost:.../Portfolio/Path as well as localhost:.../Path

# ________

## PHASE 4 - POSTMORTEM:

### compare: 

| feature               | planned/done |
|-----------------------|--------------|
| about-me-section      | DONE         |
| page-links            | DONE         |
| hamburger             | DONE         |
| about-me-name-diff    | not planned  |
| page-content-foldouts | undone       |
|                       |              |
|                       |              |

work problems list: 
- idk of any
==> I did properly note down all the things I have to test at the end

success list: 
- research helped figuring out the 'header' and 'nav' tag, as well as how to get the nav on multiple pages. 
- clear visual plan made it easy to implement the elements

- removed some of the animations from the reference-tutorial-website

| estimated time | actual time |
|----------------|-------------|
| 1 day          | 3/4 day     |

### recheck alternatives
multi-nav (in & across) -> not found anywhere, therefore not done

# ________

## PHASE 5 - Feedback: 

Notes: 
- 