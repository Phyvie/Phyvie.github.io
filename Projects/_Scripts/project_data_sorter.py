import json
import os
import shutil
from pathlib import Path
from collections import defaultdict

def load_json_files(file_paths):
    """
    Load multiple JSON files and return list of (filename, data) tuples.
    Continues loading even if some files fail.
    
    Args:
        file_paths: List of paths to JSON files
    
    Returns:
        List of tuples: [(filename1, data1), (filename2, data2), ...]
    """
    loaded_files = []
    failed_files = []
    
    print("📂 Loading JSON files...")
    
    for file_path in file_paths:
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
            
            # Validate that it's a JSON object (dict)
            if not isinstance(data, dict):
                print(f"⚠️  Warning: '{file_path}' contains a JSON array or other structure, not an object. Skipping...")
                failed_files.append((file_path, "Not a dictionary object"))
                continue
                
            loaded_files.append((os.path.basename(file_path), data))
            print(f"  ✅ Loaded: {os.path.basename(file_path)}")
            
        except FileNotFoundError:
            error_msg = f"File not found: {file_path}"
            print(f"  ❌ {error_msg}")
            failed_files.append((file_path, "File not found"))
        except json.JSONDecodeError as e:
            error_msg = f"Invalid JSON in {os.path.basename(file_path)}: {str(e)}"
            print(f"  ❌ {error_msg}")
            failed_files.append((file_path, f"JSON decode error: {str(e)}"))
        except PermissionError:
            error_msg = f"Permission denied: {file_path}"
            print(f"  ❌ {error_msg}")
            failed_files.append((file_path, "Permission denied"))
        except Exception as e:
            error_msg = f"Unexpected error reading {os.path.basename(file_path)}: {str(e)}"
            print(f"  ❌ {error_msg}")
            failed_files.append((file_path, f"Unexpected error: {str(e)}"))
    
    # Print summary
    print(f"\n📊 Load summary: {len(loaded_files)} files loaded successfully, {len(failed_files)} failed")
    
    return loaded_files

def analyze_json_objects(json_objects):
    """
    Analyze a list of JSON objects and return key statistics.
    
    Args:
        json_objects: List of tuples [(name1, obj1), (name2, obj2), ...]
                     where obj is a Python dict
    
    Returns:
        Dictionary containing analysis results
    """
    # Initialize maps
    keys_count = defaultdict(int)
    files_with_key = defaultdict(list)
    example_values = {}
    value_types = defaultdict(set)  # Track data types for each key
    
    total_objects = len(json_objects)
    
    print("\n🔍 Analyzing JSON objects...")
    
    # Process each JSON object
    for obj_name, data in json_objects:
        if not isinstance(data, dict):
            print(f"⚠️  Warning: '{obj_name}' is not a dictionary. Skipping...")
            continue
        
        # Process each key in the object
        for key, value in data.items():
            # Increment count
            keys_count[key] += 1
            
            # Track which files have this key
            files_with_key[key].append(obj_name)
            
            # Store first value as example (if not already stored)
            if key not in example_values:
                example_values[key] = value
            
            # Track value types
            value_types[key].add(type(value).__name__)
    
    print(f"  ✅ Analyzed {total_objects} objects, found {len(keys_count)} unique keys")
    
    return {
        'keys_count': dict(keys_count),
        'files_with_key': dict(files_with_key),
        'example_values': example_values,
        'value_types': {k: list(v) for k, v in value_types.items()},
        'total_objects': total_objects
    }

def generate_report(analysis_results):
    """
    Generate and print a formatted report from analysis results.
    
    Args:
        analysis_results: Dictionary from analyze_json_objects()
    """
    keys_count = analysis_results['keys_count']
    files_with_key = analysis_results['files_with_key']
    example_values = analysis_results['example_values']
    value_types = analysis_results.get('value_types', {})
    total_objects = analysis_results['total_objects']
    
    print("\n" + "="*70)
    print("📊 JSON KEY ANALYSIS REPORT")
    print("="*70)
    print(f"Total objects analyzed: {total_objects}\n")
    
    if total_objects == 0:
        print("No valid JSON objects to analyze.")
        return
    
    # Sort keys by frequency
    sorted_keys = sorted(keys_count.items(), key=lambda x: x[1], reverse=True)
    
    # Categorize keys
    keys_in_all = []
    keys_in_most = []
    keys_in_few = []
    
    for key, count in sorted_keys:
        percentage = (count / total_objects) * 100
        key_info = {
            'key': key,
            'count': count,
            'percentage': percentage,
            'files': files_with_key.get(key, []),
            'example': example_values.get(key, 'N/A'),
            'types': value_types.get(key, ['unknown'])
        }
        
        if count == total_objects:
            keys_in_all.append(key_info)
        elif count >= total_objects * 0.7:  # 70% or more
            keys_in_most.append(key_info)
        else:
            keys_in_few.append(key_info)
    
    # Print keys in all files
    if keys_in_all:
        print("🔵 KEYS IN ALL OBJECTS (100%):")
        for key_info in keys_in_all:
            example_preview = str(key_info['example'])[:50] + "..." if len(str(key_info['example'])) > 50 else str(key_info['example'])
            print(f"  • {key_info['key']}")
            print(f"    Type: {', '.join(key_info['types'])}")
            print(f"    Example: {example_preview}")
        print()
    
    # Print keys in most files
    if keys_in_most:
        print("🟡 KEYS IN MOST OBJECTS (70-99%):")
        for key_info in keys_in_most:
            print(f"  • {key_info['key']} ({key_info['count']}/{total_objects} files, {key_info['percentage']:.1f}%)")
            print(f"    Type: {', '.join(key_info['types'])}")
            print(f"    Example: {key_info['example']}")
            print(f"    Files: {', '.join(key_info['files'][:3])}{'...' if len(key_info['files']) > 3 else ''}")
        print()
    
    # Print keys in few files
    if keys_in_few:
        print("🟢 KEYS IN FEW OBJECTS (<70%):")
        for key_info in keys_in_few[:10]:  # Show top 10 to avoid clutter
            print(f"  • {key_info['key']} ({key_info['count']}/{total_objects} files, {key_info['percentage']:.1f}%)")
            print(f"    Type: {', '.join(key_info['types'])}")
            print(f"    Example: {key_info['example']}")
        if len(keys_in_few) > 10:
            print(f"    ... and {len(keys_in_few) - 10} more keys")
        print()
    
    print("\n" + "="*70)
    print("📝 SUGGESTED BASE STRUCTURE ORDER:")
    print("="*70)
    for i, (key, count) in enumerate(sorted_keys, 1):
        percentage = (count / total_objects) * 100
        bar_length = int(percentage / 5)
        bar = "█" * bar_length + "░" * (20 - bar_length)
        print(f"{i:2d}. {key:25} [{bar}] {count:2d}/{total_objects} ({percentage:5.1f}%)")

def normalize_files_at_path(base_file_path, target_file_paths, backup_suffix='.backup', altKeysDictionary = None):
    """
    Normalize multiple JSON files to match the key order of a base structure file.
    
    Args:
        base_file_path: Path to the JSON file with the desired key structure
        target_file_paths: List of paths to JSON files to normalize
        backup_suffix: Suffix to append for backup files (default: '.backup')
    
    Returns:
        Dictionary with summary of processing results
    """
    results = {
        'successful': [],
        'failed': [],
        'extra_keys_found': {}
    }
    
    print(f"\n📂 Loading base structure from: {base_file_path}")
    
    # Load and validate base file
    try:
        with open(base_file_path, 'r') as f:
            base_object = json.load(f)
        
        if not isinstance(base_object, dict):
            print(f"❌ Error: Base file must contain a JSON object (dictionary)")
            return results
            
        print(f"✅ Base structure loaded with {len(base_object)} keys")
        
    except FileNotFoundError:
        print(f"❌ Error: Base file not found: {base_file_path}")
        return results
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in base file: {e}")
        return results
    except Exception as e:
        print(f"❌ Error loading base file: {e}")
        return results
    
    # Process each target file
    print(f"\n🔄 Processing {len(target_file_paths)} target files...")
    
    for file_path in target_file_paths:
        print(f"\n  📄 Processing: {file_path}")
        
        try:
            # Load target file
            with open(file_path, 'r') as f:
                data_object = json.load(f)
            
            if not isinstance(data_object, dict):
                print(f"  ⚠️  Warning: '{file_path}' is not a JSON object, skipping...")
                results['failed'].append({'file': file_path, 'reason': 'Not a dictionary'})
                continue
            
            # Create backup
            if backup_suffix != '':
                backup_path = file_path + backup_suffix
                shutil.copy2(file_path, backup_path)
                print(f"  💾 Backup created: {backup_path}")
            
            # Order the file according to base structure
            ordered_object, extra_keys = order_file(base_object, data_object, altKeysDictionary)
            
            # Save the ordered object back to the original file
            with open(file_path, 'w') as f:
                json.dump(ordered_object, f, indent=2, ensure_ascii=False)
            
            # Track results
            results['successful'].append(file_path)
            if extra_keys:
                results['extra_keys_found'][file_path] = extra_keys
                print(f"  🔍 Found {len(extra_keys)} extra keys not in base structure")
            
            print(f"  ✅ Successfully normalized")
            
        except FileNotFoundError:
            print(f"  ❌ Error: File not found: {file_path}")
            results['failed'].append({'file': file_path, 'reason': 'File not found'})
        except json.JSONDecodeError as e:
            print(f"  ❌ Error: Invalid JSON: {e}")
            results['failed'].append({'file': file_path, 'reason': f'JSON decode error: {e}'})
        except PermissionError:
            print(f"  ❌ Error: Permission denied: {file_path}")
            results['failed'].append({'file': file_path, 'reason': 'Permission denied'})
        except Exception as e:
            print(f"  ❌ Error: Unexpected error: {e}")
            results['failed'].append({'file': file_path, 'reason': f'Unexpected error: {e}'})
    
    # Print summary
    print(f"\n📊 Processing complete:")
    print(f"  ✅ Successful: {len(results['successful'])}")
    print(f"  ❌ Failed: {len(results['failed'])}")
    
    if results['extra_keys_found']:
        print(f"\n🔍 Files with extra keys:")
        for file_path, keys in results['extra_keys_found'].items():
            print(f"  • {os.path.basename(file_path)}: {', '.join(keys)}")
    
    return results


def order_file(base_object, data_object, altKeysDictionary = None):
    """
    Reorder a JSON object to match the key order of a base structure.
    
    Args:
        base_object: Dictionary with the desired key order and default values
        data_object: Dictionary to be reordered
        altKeysDictionary: Dictionary mapping base keys to lists of alternative keys

    Returns:
        Tuple of (ordered_object, extra_keys_list)
    """
    ordered_object = {}
    extra_keys = []

    # First add all keys from base_object in order, using values from data_object if they exist
    for key in base_object:
        if key in data_object:
            ordered_object[key] = data_object[key]
        else:
            if key in altKeysDictionary:
                for altKey in altKeysDictionary[key]:
                    if altKey in data_object:
                        ordered_object[key] = data_object[altKey]
                        break

        if key not in ordered_object and base_object[key] != 'optional':
            ordered_object[key] = base_object[key]

    # Collect all base keys and their alternatives for exclusion checking
    all_base_keys = set(base_object.keys())
    all_alt_keys = set()
    for alt_keys in altKeysDictionary.values():
        all_alt_keys.update(alt_keys)

    # Then add any keys that exist in data_object but not in base_object (or alternatives)
    for key, value in data_object.items():
        # Skip if key is a base key or an alternative key that was already used
        if key not in all_base_keys and key not in all_alt_keys:
            ordered_object[key] = value
            extra_keys.append(key)

    return ordered_object, extra_keys


def normalize_files_in_directory(base_file_path, directory_path=None, file_pattern='*.json', recursive=False):
    """
    Convenience function to normalize all JSON files in a directory.
    
    Args:
        base_file_path: Path to the base structure JSON file
        directory_path: Directory containing files to normalize (if None, uses base file's directory)
        file_pattern: Pattern to match files (default: '*.json')
        recursive: Whether to search subdirectories recursively
    
    Returns:
        Results dictionary from normalize_files_at_path
    """
    if directory_path is None:
        directory_path = os.path.dirname(base_file_path)
    
    # Find all matching files
    if recursive:
        # Use pathlib for recursive glob
        path = Path(directory_path)
        target_files = [str(p) for p in path.rglob(file_pattern) if str(p) != base_file_path]
    else:
        # Non-recursive glob
        import glob
        pattern = os.path.join(directory_path, file_pattern)
        target_files = [f for f in glob.glob(pattern) if f != base_file_path]
    
    print(f"Found {len(target_files)} files to process")
    
    return normalize_files_at_path(base_file_path, target_files)

def test_file_analysis():
    """
    Run automatic test with built-in test objects.
    """
    print("🧪 Running automatic test with built-in test objects...")
    test_objects = create_test_objects()
    results = analyze_json_objects(test_objects)
    generate_report(results)
    return results

def test_file_normalization():
    baseFile = 'D:/programming/Web/Portfolio/Projects/_Scripts/Test_Data/_testBase.json'
    testFiles = [
        'D:/programming/Web/Portfolio/Projects/_Scripts/Test_Data/testA.json', 
        'D:/programming/Web/Portfolio/Projects/_Scripts/Test_Data/testB.json', 
        'D:/programming/Web/Portfolio/Projects/_Scripts/Test_Data/testC.json'
        ]
    normalize_files_at_path(baseFile, testFiles)

def create_test_objects():
    """Create some test JSON objects for demonstration"""
    return [
        ("file1.json", {"name": "John", "age": 30, "city": "New York", "department": "Engineering"}),
        ("file2.json", {"name": "Jane", "age": 25, "city": "Boston", "role": "Designer"}),
        ("file3.json", {"name": "Bob", "age": 35, "city": "New York", "department": "Sales", "active": True}),
        ("file4.json", {"name": "Alice", "age": 28, "city": "Chicago", "department": "Marketing", "tags": ["senior", "manager"]}),
        ("file5.json", {"name": "Charlie", "age": 32, "city": "Seattle", "department": "Engineering", "active": False})
    ]

def analyzeProjectFiles():
    files_to_analyze = [
        '../Bevoiced/project_data.json',
        '../Dont_Brake/project_data.json',
        '../Gragoon/project_data.json',
        '../Lone_Signal/project_data.json',
        '../Moebius_Magnus/project_data.json',
        '../Monster_Match/project_data.json',
        '../Music_Box/project_data.json',
        '../Rotations/project_data.json',
        '../Solitaire/project_data.json',       
        ]
    json_objects = load_json_files(files_to_analyze)
    results = analyze_json_objects(json_objects)
    generate_report(results)

def normalizeProjectFiles():
    base_file = '../project_data.json.template'
    files_to_normalize = [
        '../Bevoiced/project_data.json',
        '../Dont_Brake/project_data.json',
        '../Gragoon/project_data.json',
        '../Lone_Signal/project_data.json',
        '../Moebius_Magnus/project_data.json',
        '../Monster_Match/project_data.json',
        '../Music_Box/project_data.json',
        '../Rotations/project_data.json',
        '../Solitaire/project_data.json',
    ]
    alt_keys_dictionary = {
        "main-contribution": ["project-type", "primary-contribution"]
    }
    normalize_files_at_path(base_file, files_to_normalize, '', alt_keys_dictionary)

def main():
    normalizeProjectFiles()

if __name__ == "__main__":
    main()
