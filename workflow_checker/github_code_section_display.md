## PHASE 1 - DEFINITION

### 1. XY-Chain:
- showcase coding to viewer

### 2. Description
| **input** | **behaviour**          | **constraints**       | **output**                |
|-----------|------------------------|-----------------------|---------------------------|
| full code | highlight correct code | no more than 15 lines | showcase of 15 code lines |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 2                  | 2            | medium     | 2 hours     |
-> switch (use-case * impact): 
- <=3: brute-force <= 1h or backlog
- 4-6: acceptable solution <= 1day or backlog
- \>=7: elegant solution

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ~~... is intellectually interesting?~~
- ~~... appears cool?~~  
- ~~... is fun to make?~~  
- ~~... helps an imaginary future?~~ 
-> (yes > rice-value) => backlog

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
   - ~~research <=(2days, 3 answers) -> comparison table~~
   - ~~choose 2 test each <=(1.5 days, acceptable test) -> result table~~

| solution         | advantage               | disadvantage                   |
|------------------|-------------------------|--------------------------------|
| as img           | styling control         | not copyable                   |
|                  | annotatable             | needs comments for annotations |
|                  |                         | poor accessibility             |
|                  |                         | -> not cody                    |
| highlighted text | partial styling control | no styling control             |
|                  | copyable                |                                |
|                  | accessible              |                                |
|                  |                         |                                |

### NOWZyKa Workflow: is research done?

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

### NOWZyKa Workflow: confirm happy-path

### Edge-Cases: 
- 5 min brainstorm (technical issues, user stupidity, internal curruption) into frequency-impact-time-list: 

| case | solve? | **solve-time** | **frequency** | **impact** |
|------|--------|----------------|---------------|------------|
|      |        |                |               |            |

### implement cases into Solution (from Happy-Path)

### Kill Duck: 
- implementable without further thinking?
- is it "boring"?
  - common patterns?
  - no surprises?
  - obvious error handling?
  - backwards-compatible?

### NOWZyKa Workflow: confirm solution design

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