import os
import zipfile

def zip_for_github(output_filename):
    source_dir = "."
    # Directories to exclude
    exclude_dirs = {
        'node_modules', '.git', '.expo', '__pycache__', 'venv', '.venv', 'env', 
        'QuickPlate_Fixed', 'dist', 'build', '.idea', '.vscode'
    }
    
    # Specific files to exclude
    final_exclude_files = {
        '.DS_Store', output_filename, 'zip_project.py', 'prepare_for_github.py', 'QuickPlate_Project.zip'
    }

    print(f"Creating {output_filename}...")
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in final_exclude_files:
                    continue
                if file.endswith('.log') or file.endswith('.pyc') or file.endswith('.zip'):
                    continue
                    
                file_path = os.path.join(root, file)
                # Double check to ensure excluded dirs are skipped
                if any(excluded in file_path.split(os.sep) for excluded in exclude_dirs):
                    continue

                arcname = os.path.relpath(file_path, source_dir)
                
                try:
                    zipf.write(file_path, arcname)
                    # print(f"Adding {arcname}")
                except Exception as e:
                    print(f"Error adding {arcname}: {e}")
                    
    print(f"✅ Successfully created {output_filename}")

if __name__ == "__main__":
    zip_for_github("QuickPlate_GitHub_Ready.zip")
