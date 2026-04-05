import os
import re

files_to_patch = [
    'frontend/src/App.jsx',
    'frontend/src/components/LawTab.jsx',
    'frontend/src/components/PrecedentTab.jsx'
]

replacements = {
    r' bg-white\b': ' bg-white dark:bg-slate-800',
    r' bg-slate-50\b': ' bg-slate-50 dark:bg-slate-900',
    r' bg-slate-100\b': ' bg-slate-100 dark:bg-slate-800',
    r' text-slate-800\b': ' text-slate-800 dark:text-slate-200',
    r' text-slate-900\b': ' text-slate-900 dark:text-white',
    r' text-slate-700\b': ' text-slate-700 dark:text-slate-200',
    r' text-slate-600\b': ' text-slate-600 dark:text-slate-300',
    r' text-slate-500\b': ' text-slate-500 dark:text-slate-400',
    r' border-slate-200\b': ' border-slate-200 dark:border-slate-700',
    r' border-slate-100\b': ' border-slate-100 dark:border-slate-800',
    r' border-slate-300\b': ' border-slate-300 dark:border-slate-600',
    r'from-white\b': 'from-white dark:from-slate-800',
    r'to-slate-50\b': 'to-slate-50 dark:to-slate-900',
    r'bg-white/90\b': 'bg-white/90 dark:bg-slate-900/90',
    r'bg-white/95\b': 'bg-white/95 dark:bg-slate-800/95',
}

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Prevent double patching
    for k, v in replacements.items():
        # Temporarily remove existing dark mode classes matched by our replacement values
        content = content.replace(v.strip(), k.strip())
        
    for k, v in replacements.items():
        content = re.sub(k, v, content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Dark mode classes applied!")
