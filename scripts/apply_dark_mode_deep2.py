import os
import re

files_to_patch = [
    'frontend/src/App.jsx',
    'frontend/src/components/LawTab.jsx',
    'frontend/src/components/PrecedentTab.jsx'
]

replacements = {
    'text-[#9C1A15]': 'text-[#9C1A15] dark:text-red-400',
    'bg-[#9C1A15]/10': 'bg-[#9C1A15]/10 dark:bg-red-500/20',
    'border-[#9C1A15]/20': 'border-[#9C1A15]/20 dark:border-red-500/30',
    'border-[#9C1A15]/30': 'border-[#9C1A15]/30 dark:border-red-500/40',
    'border-[#9C1A15]/40': 'border-[#9C1A15]/40 dark:border-red-500/50',
    'text-[#FFC000]': 'text-[#FFC000] dark:text-yellow-400',
    'hover:bg-slate-50': 'hover:bg-slate-50 dark:hover:bg-slate-800',
    'hover:bg-slate-100': 'hover:bg-slate-100 dark:hover:bg-slate-700',
    'hover:bg-slate-200': 'hover:bg-slate-200 dark:hover:bg-slate-600',
    'hover:text-slate-900': 'hover:text-slate-900 dark:hover:text-white',
    'hover:text-slate-800': 'hover:text-slate-800 dark:hover:text-slate-200',
    'hover:text-slate-600': 'hover:text-slate-600 dark:hover:text-slate-300',
    'hover:border-slate-300': 'hover:border-slate-300 dark:hover:border-slate-500',
    'bg-slate-50': 'bg-slate-50 dark:bg-slate-900',
    'bg-white': 'bg-white dark:bg-slate-800',
    'text-slate-800': 'text-slate-800 dark:text-slate-200',
    'text-slate-900': 'text-slate-900 dark:text-white',
    'text-slate-700': 'text-slate-700 dark:text-slate-300',
    'text-slate-600': 'text-slate-600 dark:text-slate-400',
    'text-slate-500': 'text-slate-500 dark:text-slate-400',
    'border-slate-200': 'border-slate-200 dark:border-slate-700',
    'border-slate-100': 'border-slate-100 dark:border-slate-800',
    'border-slate-300': 'border-slate-300 dark:border-slate-600',
    'from-white': 'from-white dark:from-slate-800',
    'to-slate-50': 'to-slate-50 dark:to-slate-900',
}

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Prevent double patching by replacing the full potential string back to the original key
    for k, v in replacements.items():
        content = content.replace(v, k)
        
    # Apply replacements
    for k, v in replacements.items():
        # Add word or space boundary logic to prevent nested matching (like bg-white picking up from bg-white/90)
        # Using simple string replace where valid, but making sure we don't mess up already dark tags
        # To avoid messy code, just string replace the exact class but only if it's surrounded by spaces or quotes
        pass 

    # Since regex boundaries failed on custom tails like /10 or ], let's use a safer word-by-word builder
    words_replaced = []
    
    # A generic fix: read file, split by space or quotes (roughly), replace tokens, join back.
    # Actually, simpler: replace full keys with values, but only if they are not already part of the value.
    # Let's do a direct replace based on order of length so longer strings match first.
    def process(text):
        sorted_keys = sorted(replacements.keys(), key=len, reverse=True)
        # remove all dark counterparts first to clean the slate
        for k in sorted_keys:
            v = replacements[k]
            dark_part = v.replace(k, '').strip()
            if dark_part:
                text = text.replace(' ' + dark_part, '')
                text = text.replace('"' + dark_part, '"')
                text = text.replace("'" + dark_part, "'")
                text = text.replace('`' + dark_part, '`')
                
        # now insert proper replacement combinations
        for k in sorted_keys:
            # We ONLY want to replace ' k ' with ' v '. Also handle quotes `"k `, ` k"`, etc.
            text = re.sub(r'(?<=[\s"\'`])' + re.escape(k) + r'(?=[\s"\'`])', replacements[k], text)
        return text

    new_content = process(content)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Safely applied deep dark mode properties!")
