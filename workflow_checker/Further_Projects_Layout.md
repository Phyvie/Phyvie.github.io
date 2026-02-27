## PHASE 1 - DEFINITION

### 1. XY-Chain:
- Show further skills

### 2. Description
| **input**                 | **behaviour**            | **constraints**                          | **output**                                    |
|---------------------------|--------------------------|------------------------------------------|-----------------------------------------------|
| mouse-scroll & 1/2 clicks | clean overview of skills | no visual clutter, not too much clicking | visual representation of skills (+ some info) |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort                                 |
|--------------------|--------------|------------|---------------------------------------------|
| 3                  | 2            | low        | 2 day (1 for finding content, 1 for layout) |
Begin-Time: 2026 Feb. 26, 15:00
Finish-Time: 

-> switch (use-case * impact): 
- ~~<=3: brute-force <= 1h or backlog~~
- ~~4-6: acceptable solution <= 1day or backlog~~
- **\>=7: elegant solution**

### 4. Kill Duck: 
am I creating this, only because it ... (strike-through wrong ones)
- ~~... is intellectually interesting?~~
- ... appears cool?  
- ~~... is fun to make?~~  
- ~~... helps an imaginary future?~~ 
-> any yes = backlog

### Summary: 
I need to list the skills I have and support those skills with some visuals. 

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

| solution                                   | advantage                            | disadvantage                             |
|--------------------------------------------|--------------------------------------|------------------------------------------|
| keep project gallery                       | easiest to implement                 | too much clutter, not clear what is what |
| project-gallery + other-skills             | half-implemented; could use scroller | less visual                              |
| skill-list, loading extra content on click | visually cleanest                    | needs some more time to implement        |
|                                            |                                      | no visual capture                        |
| project gallery with filter                | halfway-implemented                  | filter implementation time               |
|                                            | visual hook & reduced clutter        |                                          |
|                                            |                                      |                                          |
==> The filtering solution led to a try-out coding session before checking plugins, which led to checking plugins, which takes time

| Filtering-Solution | advantage | disadvantage                   |
|--------------------|-----------|--------------------------------|
| self-code          | half-done | unsafe, maybe lacking features |
|                    |           |                                |


Filter-Tag-Categories: 
Engine (Unity / Unreal / Other), Programming Language (c++ / c# / python), Plugins/Libraries (UniRX, ...), other Software (Blender, Reaper, Fmod), Contributions / Area of Work (Audio, Level Design, Backend-Coding, ...), Project-Type (Puzzle Game, ...)

| Tag                 | Bevoiced | Dont Brake | Gragoon | Lone Signal | Moebius Magnus | Monster Match | Music Box | Rotations | Solitaire | Bitsy | Analogue Game |
|---------------------|----------|------------|---------|-------------|----------------|---------------|-----------|-----------|-----------|-------|---------------|
| Unity & C#          | +        | +          |         |             | +              | +             | +         | +         | +         |       |               |
| Unreal & C++        |          |            | +       | +           |                |               |           |           |           |       |               |
| Other Engine        |          |            |         |             |                |               |           |           |           | +     | +             |
| group-made-game     |          |            |         | +           | +              | +             | +         |           |           |       |               |
| group-made-mechanic | +        |            | +       |             |                |               |           |           |           |       |               |
| solo-project        |          | +          |         |             |                |               |           | +         | +         |       | +             |
| solo-mechanic       |          |            |         |             |                |               |           |           |           | +     |               |
| Level Design        |          | +          | +       |             |                |               | +         |           | +         |       |               |
| Audio               | +        |            |         |             | +              |               |           |           |           |       |               |
| Visuals             |          |            |         |             |                |               |           |           |           |       |               |
| Group               | +        |            | +       | +           | +              | +             | +         | +         |           |       |               |
| Solo                |          | +          |         |             |                |               |           |           | +         | +     | +             |
| GDD                 |          |            |         |             | +              | +             | +         |           |           |       |               |
| Coding              | +        | +          | +       | +           |                | +             | +         | +         | +         |       |               |
| Educational         |          |            |         |             |                | +             |           | +         |           |       |               |
|                     |          |            |         |             |                |               |           |           |           |       |               |

### Solution Summary: 
filter works without issues

### Happy-Path: 
**simple** (<= 1hour): pseudo-code lines
- **default** (<= 1day): flowchart & rubber-duck
- **complex** (week): separate into tasks
- **refactor**: check current documentation, goto corresponding case  
==> this really isn't very helpful, because for simple features where I have a structure in mind, but am not sure whether it works, it makes more sense to test it instead of creating a flowchart or pseudo-code-lines. But maybe I should actually rubber duck these approaches before I try to implement them. 

### Kill Duck
- am I using this solution, only because it ...
- ... is intellectually interesting?
- ~~... appears cool?~~
- ... is fun to make?
- ~~... helps an imaginary future?~~
-> any yes = kill

### NOWZyKa Workflow: confirm happy-path

### Edge-Cases: 
- 5 min brainstorm (technical issues, user stupidity, internal curruption) into frequency-impact-time-list: 

| case                                       | **frequency** | **impact** | solution-idea             | **solve-time** | solve?   |
|--------------------------------------------|---------------|------------|---------------------------|----------------|----------|
| nothing selected                           | 3             | 3          | show everything at first  | 1min           | YES      |
|                                            |               |            | store active filter-tag   | 1h             | try      |
| user doesn't understand they have to click | 2             | 1          | little text "filter:"     | 5min           | YES      |
| wrong tag formatting / name                | 1             | 3          | pre-parse & cache filters | 2h             | consider |
|                                            |               |            | ignore                    | 0min           | no       |
|                                            |               |            | tag-list                  | 1h             | YES      |
|                                            |               |            |                           |                |          |

### implement cases into Solution (from Happy-Path)

### Kill Duck: 
- implementable without further thinking?
- is it "boring"?
  - common patterns?
  - no surprises?
  - obvious error handling?
  - backwards-compatible?

### NOWZyKa Workflow: Solution Design Summary

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