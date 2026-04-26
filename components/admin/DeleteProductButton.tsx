"use client"

import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/lib/actions/product.actions"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        
        setLoading(true);
        try {
            await deleteProduct(id);
            toast({ title: "Product Deleted" });
            router.refresh();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={loading}
            className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 disabled:opacity-50"
            title="Delete Product"
        >
            <Trash2 size={16} />
        </button>
    )
}
