"use client"

import { WizardData } from "./ProductWizard"
import { Check } from "lucide-react"

interface StepTemplateProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
}

const TEMPLATES = {
    software: [
        { id: "software-saas", name: "SaaS Modern", description: "High-converting layout for SaaS products with feature grids and pricing tables.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=SaaS+Modern" },
        { id: "software-minimal", name: "App Minimal", description: "Clean, focused layout for mobile apps or simple tools.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=App+Minimal" },
    ],
    ebook: [
        { id: "ebook-launch", name: "Standard Launch", description: "Classic book sales page with author bio and chapter preview.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Standard+Launch" },
        { id: "ebook-simple", name: "Simple Download", description: "Direct and to the point. Great for lead magnets.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Simple+Download" },
        { id: "ebook-fiction", name: "Fiction Books", description: "For novels, thrillers, and story-driven content.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Fiction" },
        { id: "ebook-non-fiction", name: "Non-Fiction Books", description: "For guides, biographies, and factual content.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Non-Fiction" },
        { id: "ebook-coloring", name: "Coloring Books", description: "Showcase patterns and artistic designs.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Coloring+Book" },
        { id: "ebook-children", name: "Children’s Books", description: "Playful layout for kids' stories.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Childrens+Book" },
        { id: "ebook-activity", name: "Activity & Puzzle", description: "For crosswords, sudokus, and activity books.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Activity+Book" },
        { id: "ebook-journal", name: "Journals & Planners", description: "For low-content books and organizers.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Journal" },
        { id: "ebook-academic", name: "Educational & Academic", description: "Textbooks and study guides.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Academic" },
        { id: "ebook-spiritual", name: "Spiritual & Mindfulness", description: "Calm and serene layout.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Spiritual" },
        { id: "ebook-artistic", name: "Creative & Artistic", description: "For art portfolios and instruction.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Artistic" },
        { id: "ebook-lifestyle", name: "Lifestyle & Hobby", description: "Cooking, gardening, and DIY.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Lifestyle" },
        { id: "ebook-professional", name: "Professional & Career", description: "Business and career development.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Professional" },
        { id: "ebook-shortform", name: "Short-Form & Specialty", description: "Pamphlets, poetry, and niche topics.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Short-Form" },
    ],
    amazon: [],
    course: [
        { id: "course-masterclass", name: "Masterclass", description: "Video-heavy layout for selling courses.", image: "https://placehold.co/400x300/e2e8f0/1e293b?text=Masterclass" },
    ],
    external: []
} as Record<string, { id: string; name: string; description: string; image: string; }[]>;

export function StepTemplate({ data, updateData }: StepTemplateProps) {
    if (data.pageType === 'custom_html') {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <h3 className="text-xl font-bold mb-2">Custom HTML Mode</h3>
                <p className="text-slate-500">You have selected Custom HTML mode. You can skip this step and proceed to the Editor to paste your code.</p>
            </div>
        )
    }

    const templates = TEMPLATES[data.productType] || []

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Choose a Template</h2>
                <p className="text-slate-500">Select a starting point for your {data.productType} {data.pageType} page.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={`relative group cursor-pointer rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${data.templateId === template.id
                            ? "border-primary ring-2 ring-primary ring-offset-2"
                            : "border-slate-200 hover:border-primary/50"
                            }`}
                        onClick={() => updateData({ templateId: template.id })}
                    >
                        {data.templateId === template.id && (
                            <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-5 h-5" />
                            </div>
                        )}
                        <div className="aspect-video bg-slate-100 relative">
                            <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                            <p className="text-sm text-slate-500">{template.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No templates available for this product type yet.</p>
                </div>
            )}
        </div>
    )
}
