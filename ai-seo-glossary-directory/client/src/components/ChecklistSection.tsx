import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, CheckCircle2, Circle } from "lucide-react";

interface ChecklistItem {
  id: number;
  task: string;
  description: string;
}

interface ChecklistSectionProps {
  title: string;
  description: string;
  items: ChecklistItem[];
  termSlug: string;
}

export default function ChecklistSection({
  title,
  description,
  items,
  termSlug,
}: ChecklistSectionProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // Load checked items from localStorage
  useEffect(() => {
    const storageKey = `checklist_${termSlug}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setCheckedItems(new Set(JSON.parse(saved)));
    }
  }, [termSlug]);

  // Save checked items to localStorage
  const handleToggle = (id: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);

    const storageKey = `checklist_${termSlug}`;
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newChecked)));
  };

  // Generate PDF content
  const generatePDF = () => {
    let content = `${title}\n\n`;
    content += `${description}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `Progress: ${checkedItems.size} of ${items.length} items completed\n\n`;
    content += "=".repeat(50) + "\n\n";

    items.forEach((item) => {
      const isChecked = checkedItems.has(item.id);
      content += `${isChecked ? "[✓]" : "[ ]"} ${item.task}\n`;
      content += `    ${item.description}\n\n`;
    });

    // Create blob and download
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute("download", `${termSlug}-checklist.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const progress = Math.round((checkedItems.size / items.length) * 100);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
        {title}
      </h2>
      <p className="text-foreground/70 mb-6">{description}</p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Progress: {checkedItems.size} of {items.length} completed
          </span>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <Card
            key={item.id}
            className={`p-4 transition-all ${
              checkedItems.has(item.id)
                ? "bg-primary/5 border-primary/30"
                : "hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleToggle(item.id)}
                className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                {checkedItems.has(item.id) ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold transition-all ${
                    checkedItems.has(item.id)
                      ? "text-foreground/50 line-through"
                      : "text-foreground"
                  }`}
                >
                  {item.task}
                </h3>
                <p
                  className={`text-sm mt-1 transition-all ${
                    checkedItems.has(item.id)
                      ? "text-foreground/40"
                      : "text-foreground/70"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={generatePDF}
          className="flex items-center gap-2"
          variant="default"
        >
          <Download className="w-4 h-4" />
          Download as Text File
        </Button>
        {checkedItems.size > 0 && (
          <Button
            onClick={() => {
              setCheckedItems(new Set());
              localStorage.removeItem(`checklist_${termSlug}`);
            }}
            variant="outline"
          >
            Reset Checklist
          </Button>
        )}
      </div>
    </div>
  );
}
