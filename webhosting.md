## PHASE 1 - DEFINITION

### 1. XY-Chain:
- get website online
- make portfolio publicly available
- make portfolio accessible to recipient

### 2. Description
| **input** | **behaviour** | **output**              |
|-----------|---------------|-------------------------|
| files     |               | accessible to recipient |

### 3. Rice:
| Reach (#use-cases)   | Impact (0-3) | Confidence | Est. Effort |
|----------------------|--------------|------------|-------------|
| 100s of applications | 3            | medium     | 1 day       |  
-> use-cases * impact <= 5 = backlog 

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ~~... is intellectually interesting?~~
- ~~... appears cool?~~  
- ~~... is fun to make?~~  
- ~~... helps an imaginary future?~~ 
-> any yes = backlog

# ________

## PHASE 2 - DESIGN

### Research: 
switch (complexity): 
 - ~~**pre-built**: quick-check for reuse~~
 - ~~**similar**: similarity-table~~
 - **custom feature**: 
  - research <=min(0.5days, 3 answer) -> comparison table 
  - choose one and test <=(0.5day, working test) -> result table
 - ~~**custom system**:~~
   - ~~research <=(2days, 3 answers) -> comparison table~~
   - ~~choose 2 test each <=(1.5 days, working test) -> result table~~

Hosting: 

| Solution       | Advantage                    | Disadvantage                                               |
|----------------|------------------------------|------------------------------------------------------------|
| send as file   | no effort                    | sending a huge amount of files each time                   |
|                | free                         | recipient needs to download to check                       |
|                | adjustable                   |                                                            |
| GitHub Hosting | easy setup                   | only public                                                |
|                | free                         | only static content (no backend)                           |
|                | can connect to custom domain |                                                            |
|                | easy update                  |                                                            |
| Itch           | made for games               | only displays custom html/css/js in iframe on proejct page |
|                | easy setup?                  | only public                                                |
|                |                              | only static                                                |
| Netlify        |                              | payment only via credit card                               |
| Hostinger      | +domain                      | 3€/month                                                   |
|                |                              |                                                            |
|                |                              |                                                            |
|                |                              |                                                            |


How webhosting works: 
1. domain registration
2. web hosting


### NOWZyKa Workflow: is research done?

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