## PHASE 1 - DEFINITION

### 1. XY-Chain:
- show the beholder a specific part of the research (& make rest available to read too)

### 2. Description
| **input**     | **behaviour** | **output**         |
|---------------|---------------|--------------------|
| full-text-pdf | ?             | section of the PDF |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 1                  | 2            | medium     | 1 hour      |
-> use-cases * impact <= 5 = backlog 

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ... is intellectually interesting?
- ... appears cool?
- ... is fun to make?  
- ~~... helps an imaginary future?~~  
-> more yes than reach * impact = backlog

### moved to backlog, because there are not enough cases to justify learning UML right now

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - ~~**pre-built**: quick-check for reuse~~
 - ~~**similar**: similarity-table ~~
 - **custom feature**: 
  - research <=min(0.5days, 3 answer) -> comparison table 
  - choose one and test <=(0.5day, working test) -> result table
 - ~~**custom system**:~~
   - ~~research <=(2days, 3 answers) -> comparison table~~
   - ~~choose 2 test each <=(1.5 days, working test) -> result table~~

| display option            | advantage                                | disadvantage                                   |
|---------------------------|------------------------------------------|------------------------------------------------|
| as IMG                    | easy implementation                      | unaccessible (no scroll-in, no screen readers) |
|                           | consistent perfect content control       | less professional                              |
|                           | fast loading                             |                                                |
| PDF with auto-scroll      | selectable text                          | harder to implement                            |
|                           | looks professional                       | scroll can break                               |
|                           |                                          | PDF UI inside scroll-container                 |
| Convert paragraph to HTML | medium difficulty implementation         | !no sizing control                             |
|                           | accessible (selectable, scrollable, ...) |                                                |
| on-click-full-pdf         | implementable later                      | extra work                                     |
|                           | caring about copyright                   |                                                |
|                           |                                          |                                                |

# ________

## PHASE 4 - POSTMORTEM:

### compare: 

| planned             | executed            |
|---------------------|---------------------|
| display PDF-section | display PDF-section |          

work problems list: 
- converting a PDF with weird blocks into HTML
- researched forever

success list: 
- managed to accept that a PNG is fine enough

| estimated time | actual time |
|----------------|-------------|
| 1 hour         | 4 hours     |
- problem: I researched forever, because I wanted to find a good solution

# ________

## PHASE 5 - Feedback: 

Notes: 
- 