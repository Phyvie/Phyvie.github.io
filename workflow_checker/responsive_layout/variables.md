## PHASE 1 - DEFINITION

### 1. XY-Chain:
- Clean Layout

### 2. Description
| **input**               | **behaviour**                         | **constraints**         | **output**     |
|-------------------------|---------------------------------------|-------------------------|----------------|
| Contents & Screen Sizes | Adjust Content Layout to Screen Sizes | Max 3 different layouts | Content Layout |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 3                  | 3            | medium     | 1 day       |
Begin-Time: 2026-03-04, 16:41
Finish-Time: 

-> switch (use-case * impact): 
- ~~<=3: brute-force <= 1h or backlog~~
- ~~4-6: acceptable solution <= 1day or backlog~~
- \>=7: elegant solution

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ... is intellectually interesting?
- ... appears cool?  
- ... is fun to make?  
- ... helps an imaginary future? 
-> any yes = backlog

###  Summary : 
be careful not to link too many layout variables, just because you can (e.g. no need to centralise the padding of project-sections on the side together with the padding between projects into a single variable)

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - **pre-built**: quick-check for reuse
 - **similar**: similarity-table 
 - ~~**custom feature**:~~ 
 - ~~**custom system**:~~

| solution                                            | advantage        | disadvantage    |
|-----------------------------------------------------|------------------|-----------------|
| full-refactor: primitive- & semantic- & usage-layer | clean            | impl time       |
|                                                     |                  | hard to enforce |
| keep as is                                          | impl time        | not as clean    |
|                                                     | easy enforcement |                 |
|                                                     |                  |                 |

### Research Summary: 
Check whether I can work with what I have, then decide whether I need to switch to a three-layer system

### Happy-Path: 
- **simple** (<= 1hour): pseudo-code lines
- ~~**default** (<= 1day): flowchart & rubber-duck~~
- ~~**complex** (week): separate into tasks~~
- ~~**refactor**: check current documentation, goto corresponding case~~



### Kill Duck
- am I using this solution, only because it ...
- ... is intellectually interesting?
- ... appears cool?
- ... is fun to make?
- ... helps an imaginary future?
-> any yes = kill

###  Workflow: confirm happy-path
### Happy-Path Summary:

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

# ________

## PHASE 4 - POSTMORTEM:

### compare: 

| planned | executed |
|---------|----------|
|         |          

work problems list: 
- meow

success list: 
- meow

| estimated time | actual time |
|----------------|-------------|
|                |             |

### recheck alternatives

# ________

## PHASE 5 - Feedback: 

Notes: 
- 