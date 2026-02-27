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

### NOWZyKa Workflow: : Summary : 
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
- feature showcase (e.g. flowchart)

how to display info: 

| solution   | advantage           | disadvantage        |
|------------|---------------------|---------------------|
| below card |                     |                     |
|            |                     |                     |
| on card    |                     |                     |
|            |                     |                     |

### NOWZyKa Workflow: is research done?
### Research Summary: 

### Happy-Path: 
- **simple** (<= 1hour): pseudo-code lines
- **default** (<= 1day): flowchart & rubber-duck
- **complex** (week): separate into tasks
- **refactor**: check current documentation, goto corresponding case

### Kill Duck
- am I using this solution, only because it ...
- ... is intellectually interesting?
- ... appears cool?
- ... is fun to make?
- ... helps an imaginary future?
-> any yes = kill

### NOWZyKa Workflow: confirm happy-path
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

### NOWZyKa Workflow: confirm solution design
### Solution Summary: 

# ________

## PHASE 3 - IMPLEMENTATION

### Happy-Path: 
- implement feature-documentation
- implement solution
- implement happy-path test
- compare with design

### NowZyKa workflow: test success? continue!

### Edge-Cases: 
- implement edge-case-documentation
- implement edge-case test
- implement solution
    - parameterize if necessary
    - extract if necessary
    - rename new variables/functions
    - no structural changes (= no abstraction, no extra classes)

### NowZyKa workflow: tests succeed? continue!

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