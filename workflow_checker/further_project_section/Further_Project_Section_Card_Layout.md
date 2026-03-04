## PHASE 1 - DEFINITION

### 1. XY-Chain:
- show a relevant skill

### 2. Description
| **input**            | **behaviour**              | **constraints**    | **output**       |
|----------------------|----------------------------|--------------------|------------------|
| user clicks on skill | project cards get filtered | 5 sec impression!  | skill is visible |
|                      |                            | no visual overflow | additional info  |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 3                  | 3            | medium     | 1day        |
Begin-Time: 2026 Feb.27, 01:01
Finish-Time: 

-> switch (use-case * impact): 
- ~~<=3: brute-force <= 1h or backlog~~
- ~~4-6: acceptable solution <= 1day or backlog~~
- \>=7: elegant solution

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ~~... is intellectually interesting?~~
- ~~... appears cool?~~  
- ~~... is fun to make?~~  
- ~~... helps an imaginary future?~~ 
-> any yes = backlog

###  Workflow: : Summary : 
I need a visual structure that directly leads the beholders attention to the relevant feature. Additionally, more information must be available, but without instant information overflow. 

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - **similar**: similarity-table 

relevant to show: 
- img
- media
- info-block
- description
- feature showcase (e.g. flowchart) -> max.1

how to display info: -> see miro->Further_Projects_Section

### Research Summary: 
Stop worrying too much about which info should be where, just make a scroll-container
==> problem: I decided for a scroll-container & made a sketch where I could put it, but my choice had heavy layout implications; i.e. scrolling out an extra section to the right of the card doesn't work, because the project-card-media width is set to 100%, thus making the card wider to the right would make the card wider too.
==> I'm cycling back and forth between the foldout-solution and the lightbox solution, because I had some advantages/disadvantages in mind, but could never truly decide; Analysis:  
1. Problem: I didn't make an advantage/disadvantage matrix, I just sketched smth and decided to go for it
2. Solution: chatted with deepseek, which told me that users are expecting to click for more info / to remove the extra info, thus a lightbox works; Also: it told me to make a scoring matrix for advantages/disadvantages. 

### Happy-Path: 
- **default** (<= 1day): flowchart & rubber-duck

### Kill Duck
- am I using this solution, only because it ...
- ~~... is intellectually interesting?~~
- ~~... appears cool?~~
- ~~... is fun to make?~~
- ~~... helps an imaginary future?~~
-> any yes = kill

### Edge-Cases: 
- 5 min brainstorm (technical issues, user stupidity, internal curruption) into frequency-impact-time-list: 

| case | **frequency** | **impact** | solution-idea | **solve-time** | solve? |
|------|---------------|------------|---------------|----------------|--------|
|      |               |            |               |                |        |

### implement cases into Solution (from Happy-Path)

### Kill Duck: 
- implementable without further thinking?
- is it "boring"?
  - common patterns?
  - no surprises?
  - obvious error handling?
  - backwards-compatible?

### Solution Summary: 
==> look image on miro; however, I stopped using this workflow_checker after this point

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

# ________

## PHASE 4 - POSTMORTEM:

### compare: 

| planned                       | executed          |
|-------------------------------|-------------------|
| foldability                   | lightbox          |
| media, info-block             | media, info-block |
| description, feature showcase | still missing     |
|                               |                   |

==> I really need to learn to let go of my very strict ideas of how things should be. Instead I should focus way more on what is the simplest solution, such that I can get feedback more often, in order to figure out what actually needs improvement & how to improve it. 

==> Description & feature showcase are still missing, but they're not the most relevant to get the page done. Though, description > feature showcase. Might have to make a template of a project-section and just copy that into the project-card-lightbox. 

| estimated time | actual time                |
|----------------|----------------------------|
| 1 day          | idk, didn't properly track |

==> really need to more clearly separate when I do which task, such that I can also properly track how long I am spending on what. Even more important, clearer separation allows to break the blind-flow, thus I might get to better results sooner. 

### recheck alternatives
==> lightbox > foldable
====> When I have the strict thoughts in my mind I just need to chat with someone/smth in order to break them. 

# ________

## PHASE 5 - Feedback: 

Notes: 
- 