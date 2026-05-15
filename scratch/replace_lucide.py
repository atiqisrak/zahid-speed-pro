import os
import re

MAPPING = {
  'Zap': 'zapIcon', 'Database': 'database01Icon', 'Package': 'packageIcon',
  'Wrench': 'wrench01Icon', 'AlertTriangle': 'alert01Icon', 'Trophy': 'trophy01Icon',
  'Globe': 'globe02Icon', 'Map': 'map01Icon', 'BookOpen': 'book01Icon', 'Menu': 'menu01Icon',
  'X': 'cancel01Icon', 'MapPin': 'location01Icon', 'TrendingUp': 'trendUp01Icon',
  'Activity': 'activity01Icon', 'Wifi': 'wifi01Icon', 'ArrowUp': 'arrowUp01Icon',
  'Star': 'starIcon', 'ArrowDown': 'arrowDown01Icon', 'RefreshCw': 'arrowReloadHorizontalIcon',
  'Share2': 'share01Icon', 'ShieldCheck': 'shield01Icon', 'HistoryIcon': 'historyIcon',
  'SettingsIcon': 'settings01Icon', 'Copy': 'copy01Icon', 'Check': 'checkIcon',
  'Smartphone': 'smartphone01Icon', 'Router': 'routerIcon', 'HeartPulse': 'heartPulseIcon',
  'Users': 'userMultipleIcon', 'CheckCircle': 'tickCircleIcon', 'Circle': 'circleIcon',
  'PieIcon': 'pieChartIcon', 'ArrowRight': 'arrowRight01Icon', 'ArrowLeft': 'arrowLeft01Icon',
  'Clock': 'time01Icon', 'Tag': 'tag01Icon', 'Search': 'search01Icon', 'ChevronRight': 'arrowRight01Icon',
  'ExternalLink': 'linkSquare01Icon', 'PieChart': 'pieChartIcon', 'History': 'historyIcon',
  'Settings': 'settings01Icon', 'Play': 'playIcon', 'Pause': 'pauseIcon',
  'Volume2': 'volumeHighIcon', 'VolumeX': 'volumeMute01Icon', 'SkipBack': 'previousIcon',
  'SkipForward': 'nextIcon', 'FileText': 'file01Icon', 'Download': 'download01Icon',
  'Shield': 'shield01Icon', 'Info': 'informationCircleIcon', 'CheckSquare': 'tickSquareIcon'
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    lucide_match = re.search(r"import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"];?", content)
    if not lucide_match:
        return

    imported_str = lucide_match.group(1)
    content = content[:lucide_match.start()] + content[lucide_match.end():]
    
    if "import HugeIconPicker" not in content:
        # Calculate relative path to src/components/HugeIconPicker
        rel_path = os.path.relpath(os.path.join(os.getcwd(), 'src', 'components'), os.path.dirname(filepath))
        rel_path = rel_path.replace('\\', '/')
        if rel_path == '.':
            import_statement = "import HugeIconPicker from './HugeIconPicker';\n"
        else:
            import_statement = f"import HugeIconPicker from '{rel_path}/HugeIconPicker';\n"
        content = import_statement + content

    for raw_icon in imported_str.split(','):
        raw_icon = raw_icon.strip()
        if not raw_icon: continue
        
        parts = raw_icon.split(' as ')
        lucide_name = parts[0].strip()
        alias_name = parts[1].strip() if len(parts) > 1 else lucide_name
        
        mapped_name = MAPPING.get(lucide_name, 'globe02Icon')
        
        # 1. <IconName
        content = re.sub(rf"<{alias_name}\b", f"<HugeIconPicker name=\"{mapped_name}\"", content)
        # 2. </IconName>
        content = re.sub(rf"</{alias_name}>", f"</HugeIconPicker>", content)
        # 3. {icon: IconName}
        content = re.sub(rf"\bicon:\s*{alias_name}\b", f"icon:'{mapped_name}'", content)
        # 4. IconName without JSX brackets (e.g. dynamic component usage)
        # We need to skip this or it will break if they use it dynamically.
        # Luckily most are <IconName /> or icon: IconName

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

src_dir = os.path.join(os.getcwd(), 'src')
for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.tsx'):
            process_file(os.path.join(root, f))
print("Done")
