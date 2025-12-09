import os
import re

directory = r'c:\Users\ASUS\Desktop\Aviation_project\skycrew-manager\skycrew-frontend\src\components\ui'
pattern = re.compile(r'from "([^"]+)@[0-9]+\.[0-9]+\.[0-9]+"')

count = 0
for filename in os.listdir(directory):
    if filename.endswith(".tsx") or filename.endswith(".ts"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = pattern.sub(r'from "\1"', content)
        
        if new_content != content:
            count += 1
            print(f"Fixing {filename}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
print(f"Fixed {count} files.")
