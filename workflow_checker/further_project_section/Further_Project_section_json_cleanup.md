## PHASE 1 - DEFINITION

### 1. XY-Chain:
- keep json files clean

### 2. Description
| **input**       | **behaviour**             | **constraints** | **output**                                                                          |
|-----------------|---------------------------|-----------------|-------------------------------------------------------------------------------------|
| >= 9 json files | scan, reorder, addMissing |                 | json files in same order filled with previous content & markers for missing content |

### 3. Rice:
| Reach (#use-cases) | Impact (0-3) | Confidence | Est. Effort |
|--------------------|--------------|------------|-------------|
| 3                  | 1            | low        | 1.5 hours   |
Begin-Time: 2026-03-03, 15:33
Finish-Time: 2026-04-03, 01:49
Time-Spent: 3.5hours

-> ~~switch (use-case * impact):~~ 
- <=3: brute-force <= 1h or backlog
- ~~4-6: acceptable solution <= 1day or backlog~~
- ~~\>=7: elegant solution~~

### 4. Kill Duck: 
~~am I creating this, only because it ... (strike-through wrong ones)~~
- ... is intellectually interesting?
- ~~... appears cool?~~  
- ~~... is fun to make?~~  
- ... helps an imaginary future? 
-> any yes = backlog

### Summary : 
I could also just manually adjust the json-files, because that wouldn't require me to write a python script. 
However, in any way I need to have a basic structure for the json-file so I could create that, than ask deepseek to write a simple adjustment script; however, if deepseek fails, I should not spend further time on debugging the python script, instead I should just manually adjust, because that will take ~1 hour

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

| solution                         | advantage                                               | disadvantage        |
|----------------------------------|---------------------------------------------------------|---------------------|
| create base script layout        |                                                         |                     |
| manually check all files         | extra thought into what is actually needed in the files | checking time       |
| write script to check all files  | quicker for checking & ensures I see everything         | implementation time |
|                                  |                                                         |                     |
| manually rework the json files   |                                                         | manual time         |
| script for reordering json files | automatic                                               | implementation time |
|                                  | can add error-safety                                    |                     |
|                                  |                                                         |                     |

###  Workflow: is research done?
### Research Summary: 

### Happy-Path: 
- ~~**simple** (<= 1hour): pseudo-code lines~~
- **default** (<= 1day): flowchart & rubber-duck
- ~~**complex** (week): separate into tasks~~
- ~~**refactor**: check current documentation, goto corresponding case~~

```mermaid 
flowchart TD
    NormalizeFiles[F:NormalizeFiles]
    LoadBaseStructure[F:ParseBaseStructure]
    ReorderFile[F:ReorderFile]
    
    Start -- base_structure_file, to_adjust_files --> NormalizeFiles
    
    NormalizeFiles -- base_structure_file --> LoadBaseStructure
    LoadBaseStructure --> ParseJsonBaseFile
    LoadBaseStructure --> ListKeys[write a list of keys into json_base_structure]
    LoadBaseStructure -- return json_base_structure --> NormalizeFiles
        
    NormalizeFiles -- for each file in to_adjust_files <br> with base_structure as parameter --> ReorderAndSaveFile
    ReorderAndSaveFile --> ReorderFile
    ReorderFile --> LoadJsonDataFile[Parse the json data file into json_data_object]
    ReorderFile --> NewJsonData[create a new json file]
    ReorderFile --> CheckAdditionalKeys[append any keys in json_data_object.keys that are not in json_base_structure.keys to extra_keys and console-log them]
    ReorderFile -- for each key in json_base_structure.keys.appendUnique'json_data_object.keys' --> AddKeyValue[add the key into the new file, <br> set value = json_data_object.value ? json_data_object.value : base_structure.value]
    ReorderFile -- return new_json_data --> ReorderAndSaveFile
    ReorderAndSaveFile --> SaveFile[save new_json_data into original_file_name]
```

AI Improved & reworked flowchart
```mermaid
flowchart TD    
    Start([Start]) --> NormalizeFilesAtPaths
    NormalizeFilesAtPaths --> LoadBase[Load base structure file]
    LoadBase --> ValidateBase{Valid JSON?}
    ValidateBase -- No --> Exit([Exit with error])
    ValidateBase -- Yes --> LoopFiles
        
    LoopFiles -- for each 'file.json' in json_data_files: --> FileLoopStart
    subgraph FileLoop
        FileLoopStart([Start]) --> LoadJsonFile
        LoadJsonFile[Load file.json into jsonDataObject] --> ValidateFile{Valid JSON?}
        ValidateFile -- No --> LogSkip[Log error and skip]
        ValidateFile -- Yes: 'jsonObject' --> CreateBackup
        CreateBackup[Create a copy of file.json at file_backup.json] -- 'base_object',  jsonDataObject' --> FuncOrderFile
        subgraph FuncOrderFile[Func:OrderFile 'base_object', 'data_object']
            NewJsonObject[Create new json-object] --> AddBaseKeys
            AddBaseKeys[Add keys from base_object with <br> value=data_object.value ? data_object.value : base_object.value] --> AddExtraKeys
            AddExtraKeys[Add key-value pairs only present in data_object] --> LogExtras[Log any extra keys found]
            LogExtras --> ReturnObject[Return new_json_object]
        end
        FuncOrderFile --> SaveFile[Save new_json_object into original_file_name]
    end

    FileLoop --> End([End])
```

```mermaid
flowchart TD
    Start([Start]) --> CreateNewList[Create new map keys_count]
    CreateNewList --> ProcessFile[for each file to check]
    
    ProcessFile --> LoadFile[Load file]
    LoadFile --> ValidateFile{Valid JSON?}
    ValidateFile -- No --> LogSkip[Log error and skip]
    ValidateFile -- Yes --> AddKeysToList[Add Keys To List]
    AddKeysToList -- for each key in file --> IncrementKeyCount[Increment key count in keys_count]
    IncrementKeyCount --> LoopProcessFile{More files?}
    LoopProcessFile -- Yes --> ProcessFile
    LoopProcessFile -- No --> Summary[Print list keys_count]
    Summary --> End([End])
```

AI improved: 
```mermaid 
flowchart TD
    Start([Start]) --> InitMaps[Create maps: <br> keys_count, <br> files_with_key, <br> example_values]
    
    InitMaps --> ProcessFile[for each file passed in as files_to_check]
    
    ProcessFile --> LoadFile[Load file]
    LoadFile --> ValidateFile{Valid JSON?}
    ValidateFile -- No --> LogSkip[Log error and skip]
    ValidateFile -- Yes --> GetKeys
    
    GetKeys[Get all keys from file] --> ProcessKeys[for each key in file]
    ProcessKeys --> IncrementCount[Increment key count]
    IncrementCount --> TrackFilePresence[Add filename to files_with_key'key']
    TrackFilePresence --> StoreExample[Store first value as example]
    StoreExample --> LoopKeys{More keys?}
    
    LoopKeys -- Yes --> ProcessKeys
    LoopKeys -- No --> LoopProcessFile{More files?}
    LoopProcessFile -- Yes --> ProcessFile
    LoopProcessFile -- No --> GenerateReport
    
    GenerateReport --> SortKeys[Sort keys by frequency]
    SortKeys --> ShowStats
    
    ShowStats[Print report with:] 
    ShowStats --> ShowAlways[Keys in ALL files]
    ShowAlways --> ShowSometimes[Keys in SOME files]
    ShowSometimes --> ShowExamples[Sample values for each key]
    
    ShowExamples --> End([End])
```


### Kill Duck
- am I using this solution, only because it ...
- ... is intellectually interesting?
- ... appears cool?
- ... is fun to make?
- ... helps an imaginary future?
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

###  Workflow: confirm solution design
### Solution Summary: 

# ________

## PHASE 3 - IMPLEMENTATION
==> I hardly implemented anything, I let the AI handle the implementation; however I still had to fix issues & make sure the AI correctly understands what I want. Sometimes it helps to adjust my diagram & to reset the AI such that it can rewrite fully instead of making weird adjustments. 

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
==> Might have overlooked edge-cases again. But mostly I forgot to tell the AI how it is supposed to structure my code. Maybe I should write what the functions are supposed to do and then hand it over to the AI. 

###  workflow: tests succeed? continue!

# ________

## PHASE 4 - POSTMORTEM:

### compare: 


work problems list: 
- AI was coding weird stuff that didn't work as intended, because it didn't always understand what I wanted & I have a hard time to tell AI what to improve & how; e.g. telling it "instead of function X, write function Y", it just gives out both function. Also without writing the bare-bones structure of the actual code myself (e.g. maybe just pseudo-code) I'm not able to completely think through how the code-functions (not functionality) should be structured. 
- did not learn python while implementing the solution. 

success list: 
- avoided a lot of manual work
- AI did write my functions, thus I didn't need to learn python for this

| estimated time | actual time |
|----------------|-------------|
| 1.5 hours      | 3.5 hours   |
==> setting up the AI to create the whole code-structure took way longer than expected. 
I'm not sure whether the flow-chart-approach is the correct approach or it might be better to write pseudo-code instead

### recheck alternatives
==> manuall adjustment of files could have worked, but I don't know how long it would have actually taken & how much I would have been confused during that process. 

# ________

## PHASE 5 - Feedback: 

Notes: 
- 