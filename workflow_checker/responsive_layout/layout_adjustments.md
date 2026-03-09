## PHASE 1 - DEFINITION

### 1. XY-Chain:
- ensure layout works for differing screen sizes

### 2. Description
| **input** | **behaviour**      | **constraints**         | **output**        |
|-----------|--------------------|-------------------------|-------------------|
| content   | adjust screen size | no layout fragmentation | responsive layout |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 3                  | 2.5          | high       | 3/4         |
Begin-Time: 2026-05-03, 15:30
Finish-Time: 2026-06-03, 00:30

-> switch (use-case * impact): 
- ~~<=3: brute-force <= 1h or backlog~~
- 4-6: acceptable solution <= 1day or backlog
- \>=7: elegant solution

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ~~... is intellectually interesting?~~
- ... appears cool?  
- ~~... is fun to make?~~  
- ~~... helps an imaginary future?~~ 
-> any yes = backlog

###  Workflow: : Summary : 
Need to be a bit careful, that I don't overdo the adjustments to every single possible screen size => I have certain resolutions set up, I cna wiggle them a bit, but shouldn't go out of my way to fix every single layout break. 

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - ~~**pre-built**: quick-check for reuse~~
 - **similar**: similarity-table 
 - ~~**custom feature**:~~ 
 - ~~**custom system**:~~

I already have a layout built, I just need to ensure it works for every screen size. I should not rebuilt the whole layout, but ensure that my adjustments don't break existing stuff.

###  Workflow: is research done?
### Research Summary: 

### Happy-Path: 
- ~~**simple** (<= 1hour): pseudo-code lines~~
- **default** (<= 1day): flowchart & rubber-duck
- ~~**complex** (week): separate into tasks~~
- ~~**refactor**: check current documentation, goto corresponding case~~

Path to better layout: 
1. Set of tests:
   - Galaxy S20 vertical
   - Galaxy S20 horizontal
   - iPadOS mini vertical
   - iPadOS mini horizontal
   - full-HD
   - FullHD vertical-half-height
   - FullHD horizontal-half-height
   - 2560x1080
Each with rem 16px, 32px
2. List of issues: (issue types: content hidden; odd layout; weird spacing )

| Problem                                                        | resolutions                   | Prio | Time | diff              |
|----------------------------------------------------------------|-------------------------------|------|------|-------------------|
| missing image of me                                            | galaxy vert, galaxy hor       | 3    | 1    | ++ SOLVED         |
| about-me text-bomb                                             | galaxy vert, FHD.5h           | 2    | 2    | 0                 |
|                                                                |                               |      |      |                   |
| about-me-image huge top- & bottom-margin                       | FHD.5v                        | 2    | 3    | -                 |
| too wide vertical spacing around project-section-media         | galaxy hor, iPad vert         | 2    | 3    | -                 |
| project-section-title under project                            | galaxy vert, galaxy hor       | 1    | 3    | --                |
| project-section-media huge top-bottom-margin                   | FHD.5h, FHD.5v                | 2    | 3    | -                 |
| project-section-info-block is too wide (a lot of empty space)  | galaxy hor                    | 1    | 3    | --                |
|                                                                |                               |      |      |                   |
| about-me-image scales weird (prob due to transform: scale(...) | all                           | 0    | 1    | - SOLVED          |
| about-me-image too small for rounding in all corners           | 4k                            | 0    | 1    | - SOLVED          |
|                                                                |                               |      |      |                   |
| too wide horizontal spacing around project-section-media       | galaxy vert                   | 2    | 1    | + FB-REQ          |
| further projects large horizontal padding                      | iPad vert                     | 1    | 1    | 0 FB-REQ          |
|                                                                |                               |      |      |                   |
| too wide spacing around project-section-info-block             | galaxy vert                   | 1    | 1    | 0 SOLVED          |
| weird spacing around info-block                                | FHD                           | 1    | 1    | 0 FB-REQ          |
| project-section-info-block overflowing                         | big-font                      | 3    | 2    | +                 |
| project-section titles not centered                            | galaxy vert                   | 1    | 1    | 0 SOLVED          |
| rotation link-to-page top-margin too large                     | FullHD                        | 2    | 1    | + FB-REQ          |
|                                                                |                               |      |      |                   |
| further skills squeezed left                                   | galaxy vert                   | 2    | 2    | 0                 |
| further skills not justified                                   | galaxy hor, iPad vert, FHD.5h | 2    | 3    | -                 |
| further skills too long                                        | galaxy vert                   | 2    | 3    | -                 |
|                                                                |                               |      |      |                   |
| further skills tags not adjusted to font-size                  | big-font                      | 3    | 1    | ++ ACTUALLY WRONG |
|                                                                |                               |      |      |                   |
| further projects not centered                                  | galaxy hor                    | 1    | 1    | 0 SOLVED          |
| further projects only 1 per row                                | FHD.5v                        | 2    | 1    | + SOLVED          |
| further projects project cards very large                      | iPad vert, FHD.5v             | 1    | 1    | 0 SOLVED          |
|                                                                |                               |      |      |                   |
| project card too small overlay spacing                         | iPad vert                     | 1    | 1    | 0 SOLVED          |
| project card border-radius of overlay & card mismatch          | iPad vert, galaxy vert        | 1    | 1    | 0 SOLVED/IDC      |
| project card overlay taking up too much space of media         | big-font                      | 2    | 3    | -                 |
|                                                                |                               |      |      |                   |
| tag-texts overflowing their tag                                | big-font                      | 3    | 2    | + SOLVED          |
| img-in-font not adjusted to font-size                          | big-font                      | 3    | 2    | + SOLVED          |
| scroll-container button not adjusted to font-size              | big-font                      | 3    | 1    | ++ ACTUALLY WRONG |
|                                                                |                               |      |      |                   |
| Rotation Parameterization too short description                | all                           | 3    | 3    | 0                 |
|                                                                |                               |      |      |                   |

### Kill Duck
- am I using this solution, only because it ...
- ~~... is intellectually interesting?~~
- ... appears cool?
- ~~... is fun to make?~~
- ~~... helps an imaginary future?~~
-> any yes = kill

### Happy-Path Summary:
I fix the time-1 first, followed by positive diff, then rechecking whether I wanna/need to fix the rest

### Edge-Cases: 

| case                                      | **frequency** | **impact** | solution-idea | **solve-time** | solve? |
|-------------------------------------------|---------------|------------|---------------|----------------|--------|
| overlooked resolution / settings          | 0             | 3          |               |                | NO     |
| later layout changes break current layout | 1             | 1          |               |                | NO     |
|                                           |               |            |               |                |        |

### Edge-case Summary:
Ignore

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
==> I did not really follow the implementation workflow, because I made another one above in the design-phase. 

### Overlooked: 
| Problem                             | resolutions | Prio | Time | diff |
|-------------------------------------|-------------|------|------|------|
| project-section-media is small      | galaxy hor  | 1    | 2    | -    |
|                                     |             |      |      |      |

# ________

## PHASE 4 - POSTMORTEM:

### compare: 

| planned | executed |
|---------|----------|
|         |          

work problems list: 
- idk whether it was necessary to put every single problem into the table; on the other hand, putting things into the table took ~1h, while solving them took way more time; maybe tracking more specifically where I spent how much time would be worth it, such that I can more easily figure out which steps took how long & whether they're worth the time

success list: 
- cleanly worked through my list; realized that two of the topics are not quick-fixes, but rather need precise planning; now I am not sure whether I should still fix those layout-issues or go to the next problem. 

| estimated time | actual time |
|----------------|-------------|
| 3/4 day        | 3/4 day     |

### recheck alternatives

# ________

## PHASE 5 - Feedback: 

Notes: 
- 