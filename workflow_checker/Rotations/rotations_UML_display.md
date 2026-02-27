## PHASE 1 - DEFINITION

### 1. XY-Chain:
- display code structure

### 2. Description
| **input** | **behaviour**        | **output**     |
|-----------|----------------------|----------------|
| my code   | convert to structure | code structure |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 3                  | 2            | medium     | 1 day       |
-> use-cases * impact <= 5 = backlog 

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- **... is intellectually interesting?**
- **... appears cool?**
- **... is fun to make?**    
- ~~... helps an imaginary future?~~  
-> any yes = backlog

### moved to backlog, because there are not enough cases to justify learning UML right now

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - **pre-built**: quick-check for reuse
 - **similar**: similarity-table 
 - **custom feature**: 
  - research <=min(0.5days, 3 answer) -> comparison table 
  - choose one and test <=(0.5day, working test) -> result table
 - **custom system**:
   - research <=(2days, 3 answers) -> comparison table
   - choose 2 test each <=(1.5 days, working test) -> result table

### Check Workflow: is research done?

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

### Check Workflow: confirm happy-path

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

### Check Workflow: confirm solution design

# ________

## PHASE 3 - IMPLEMENTATION

### Happy-Path: 
- implement feature-documentation
- implement solution
- implement happy-path test
- compare with design

### Check workflow: test success? continue!

### Edge-Cases: 
- implement edge-case-documentation
- implement edge-case test
- implement solution
    - parameterize if necessary
    - extract if necessary
    - rename new variables/functions
    - no structural changes (= no abstraction, no extra classes)

### Check workflow: tests succeed? continue!

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