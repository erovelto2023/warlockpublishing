import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X, TrendingUp, AlertCircle } from "lucide-react";

interface SEOKeyword {
  id: number;
  keyword: string;
  monthlyVolume: number;
  difficulty: "Low" | "Medium" | "High";
  isCustom?: boolean;
}

interface MarketStrategyProps {
  monthlySearchVolume: string;
  volumeRange: string;
  difficulty: "Low" | "Medium" | "High";
  relatedKeywords: string[];
}

export default function MarketStrategySection({
  monthlySearchVolume,
  volumeRange,
  difficulty,
  relatedKeywords,
}: MarketStrategyProps) {
  const [keywords, setKeywords] = useState<SEOKeyword[]>(
    relatedKeywords.map((kw, idx) => ({
      id: idx,
      keyword: kw,
      monthlyVolume: 0,
      difficulty: "Medium",
    }))
  );
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newVolume, setNewVolume] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<"Low" | "Medium" | "High">("Medium");

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const keyword: SEOKeyword = {
        id: Math.max(...keywords.map(k => k.id), 0) + 1,
        keyword: newKeyword,
        monthlyVolume: parseInt(newVolume) || 0,
        difficulty: newDifficulty,
        isCustom: true,
      };
      setKeywords([...keywords, keyword]);
      setNewKeyword("");
      setNewVolume("");
      setNewDifficulty("Medium");
      setShowAddKeyword(false);
    }
  };

  const handleRemoveKeyword = (id: number) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Low":
        return "bg-green-100 text-green-800 border-green-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "High":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
        Market Strategy & SEO
      </h2>
      <p className="text-foreground/70 mb-8">
        Search volume, difficulty, and keyword tracking for this topic
      </p>

      {/* Main Metrics */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/70 mb-1">Monthly Search Volume</p>
              <p className="text-3xl font-bold text-foreground">{monthlySearchVolume}</p>
              <p className="text-xs text-foreground/60 mt-2">{volumeRange}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/70 mb-1">Keyword Difficulty</p>
              <p className="text-3xl font-bold text-foreground">{difficulty}</p>
              <p className="text-xs text-foreground/60 mt-2">
                {difficulty === "Low"
                  ? "Easy to rank"
                  : difficulty === "Medium"
                  ? "Moderate competition"
                  : "Highly competitive"}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div>
            <p className="text-sm text-foreground/70 mb-1">Keywords Tracked</p>
            <p className="text-3xl font-bold text-foreground">{keywords.length}</p>
            <p className="text-xs text-foreground/60 mt-2">
              {keywords.filter(k => k.isCustom).length} custom keywords
            </p>
          </div>
        </Card>
      </div>

      {/* Add Keyword Form */}
      {showAddKeyword && (
        <Card className="p-6 mb-6 bg-primary/5 border-primary/30">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Keyword
              </label>
              <input
                type="text"
                placeholder="Enter keyword to track"
                className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Monthly Volume
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1200"
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={newVolume}
                  onChange={(e) => setNewVolume(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Difficulty
                </label>
                <select
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={newDifficulty}
                  onChange={(e) =>
                    setNewDifficulty(e.target.value as "Low" | "Medium" | "High")
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddKeyword} className="flex-1">
                Add Keyword
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddKeyword(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Keywords List */}
      <div className="space-y-3 mb-6">
        {keywords.map((keyword) => (
          <Card key={keyword.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{keyword.keyword}</h3>
                {keyword.monthlyVolume > 0 && (
                  <p className="text-sm text-foreground/70">
                    {keyword.monthlyVolume.toLocaleString()} searches/month
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                    keyword.difficulty
                  )}`}
                >
                  {keyword.difficulty}
                </span>
                {keyword.isCustom && (
                  <button
                    onClick={() => handleRemoveKeyword(keyword.id)}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Keyword Button */}
      {!showAddKeyword && (
        <Button
          onClick={() => setShowAddKeyword(true)}
          variant="outline"
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add SEO Keyword
        </Button>
      )}
    </div>
  );
}
