import os

file_path = r'c:\Users\erove\Desktop\warlockpublishing\warlockpublishing\components\admin\UnifiedAdminDashboard.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target lines:
# 1137:                         )}
# 1138:                     </div>
# 1139:                 )}

target = """                        )}
                    </div>
                )}"""

replacement = """                        )}
                    </div>
                    );
                })()}"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success")
else:
    print("Target not found")
