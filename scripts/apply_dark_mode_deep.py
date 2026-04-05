import os
import re

files_to_patch = [
    'frontend/src/App.jsx',
    'frontend/src/components/LawTab.jsx',
    'frontend/src/components/PrecedentTab.jsx'
]

replacements = {
    # Hovers
    r' hover:bg-slate-50\b': ' hover:bg-slate-50 dark:hover:bg-slate-800',
    r' hover:bg-slate-100\b': ' hover:bg-slate-100 dark:hover:bg-slate-700',
    r' hover:bg-slate-200\b': ' hover:bg-slate-200 dark:hover:bg-slate-600',
    r' hover:text-slate-900\b': ' hover:text-slate-900 dark:hover:text-white',
    r' hover:text-slate-800\b': ' hover:text-slate-800 dark:hover:text-slate-200',
    r' hover:text-slate-600\b': ' hover:text-slate-600 dark:hover:text-slate-300',
    r' hover:border-slate-300\b': ' hover:border-slate-300 dark:hover:border-slate-500',
    # Specific brand colors adaptation for dark
    r' text-\[\#9C1A15\]\b': ' text-[#9C1A15] dark:text-red-400',
    r' bg-\[\#9C1A15\]/10\b': ' bg-[#9C1A15]/10 dark:bg-red-500/20',
    r' border-\[\#9C1A15\]/20\b': ' border-[#9C1A15]/20 dark:border-red-500/30',
    r' text-\[\#FFC000\]\b': ' text-[#FFC000] dark:text-yellow-400',
}

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Prevent double patching
    for k, v in replacements.items():
        content = content.replace(v.strip(), k.strip()) # reset
        
    for k, v in replacements.items():
        content = re.sub(k, v, content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Deep dark mode patches applied!")
