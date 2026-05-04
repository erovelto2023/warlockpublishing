import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X, DollarSign, Users, Zap } from "lucide-react";

interface ProductIdea {
  id: number;
  title: string;
  description: string;
  monetizationType: string;
  estimatedPrice: string;
  targetAudience: string;
}

interface ProductPipelineSectionProps {
  products: ProductIdea[];
  termSlug: string;
}

export default function ProductPipelineSection({
  products,
  termSlug,
}: ProductPipelineSectionProps) {
  const [customProducts, setCustomProducts] = useState<ProductIdea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    monetizationType: "Digital Product",
    estimatedPrice: "",
    targetAudience: "",
  });

  const handleAddProduct = () => {
    if (formData.title && formData.description) {
      const newProduct: ProductIdea = {
        id: Math.max(...products.map(p => p.id), ...customProducts.map(p => p.id), 0) + 1,
        ...formData,
      };
      setCustomProducts([...customProducts, newProduct]);
      setFormData({
        title: "",
        description: "",
        monetizationType: "Digital Product",
        estimatedPrice: "",
        targetAudience: "",
      });
      setShowForm(false);
    }
  };

  const handleRemoveProduct = (id: number) => {
    setCustomProducts(customProducts.filter(p => p.id !== id));
  };

  const allProducts = [...products, ...customProducts];

  const getMonetizationIcon = (type: string) => {
    switch (type) {
      case "Digital Course":
        return <Zap className="w-5 h-5" />;
      case "Service":
        return <Users className="w-5 h-5" />;
      case "SaaS/Subscription":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Product Idea Pipeline
          </h2>
          <p className="text-foreground/70 mt-2">
            Custom monetization opportunities tailored to this topic
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Strategic Idea
        </Button>
      </div>

      {/* Add Custom Product Form */}
      {showForm && (
        <Card className="p-6 mb-6 bg-primary/5 border-primary/30">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Product Title
              </label>
              <input
                type="text"
                placeholder="e.g., AI Overview Optimization Course"
                className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your product idea..."
                className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Monetization Type
                </label>
                <select
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={formData.monetizationType}
                  onChange={(e) =>
                    setFormData({ ...formData, monetizationType: e.target.value })
                  }
                >
                  <option>Digital Product</option>
                  <option>Digital Course</option>
                  <option>Service</option>
                  <option>SaaS/Subscription</option>
                  <option>Affiliate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Estimated Price
                </label>
                <input
                  type="text"
                  placeholder="e.g., $97-$297"
                  className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  value={formData.estimatedPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedPrice: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Target Audience
              </label>
              <input
                type="text"
                placeholder="e.g., Content creators, SEO professionals"
                className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({ ...formData, targetAudience: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddProduct} className="flex-1">
                Add Product Idea
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {allProducts.map((product) => (
          <Card
            key={product.id}
            className="p-6 hover:shadow-lg transition-shadow relative group"
          >
            {/* Remove button for custom products */}
            {customProducts.some(p => p.id === product.id) && (
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5 text-destructive hover:text-destructive/80" />
              </button>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className="text-primary">
                {getMonetizationIcon(product.monetizationType)}
              </div>
              <div className="flex-1">
                <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-secondary text-secondary-foreground mb-2">
                  {product.monetizationType}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              {product.title}
            </h3>

            <p className="text-sm text-foreground/70 mb-4">
              {product.description}
            </p>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-foreground">Price: </span>
                <span className="text-primary">{product.estimatedPrice}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Audience: </span>
                <span className="text-foreground/70">{product.targetAudience}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {allProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-foreground/70 mb-4">No product ideas yet.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Idea
          </Button>
        </div>
      )}
    </div>
  );
}
