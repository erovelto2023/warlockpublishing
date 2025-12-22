"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { createProduct } from "@/lib/actions/product.actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)), {
        message: "Price must be a valid number.",
    }),
    imageUrl: z.string().url({
        message: "Please enter a valid URL.",
    }),
    category: z.string().min(2),
    format: z.string().min(2),
    grooveSellId: z.string().optional(),
    grooveSellEmbed: z.string().optional(),
    amazonLink: z.string().optional(),
    isAmazonProduct: z.boolean(),
    isHidden: z.boolean(),
    licenseType: z.string().min(2),
    htmlContent: z.string().optional(),
    penNameId: z.string().optional(),
    productType: z.string(),
})

interface ProductFormProps {
    penNames?: { _id: string; name: string }[];
}

export function ProductForm({ penNames = [] }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "0",
            imageUrl: "",
            category: "",
            format: "",
            grooveSellId: "",
            grooveSellEmbed: "",
            amazonLink: "",
            isAmazonProduct: false,
            isHidden: false,
            licenseType: "PLR",
            htmlContent: "",
            penNameId: "",
            productType: "ebook",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            if (values.productType === 'amazon') {
                values.isAmazonProduct = true;
            }
            await createProduct({ ...values, price: Number(values.price) })
            router.push("/admin")
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {penNames.length > 0 && (
                    <FormField
                        control={form.control}
                        name="penNameId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author / Pen Name</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an author" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {penNames.map((penName) => (
                                            <SelectItem key={penName._id} value={penName._id}>
                                                {penName.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a product type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ebook">Ebook</SelectItem>
                                    <SelectItem value="software">Software</SelectItem>
                                    <SelectItem value="amazon">Amazon Product</SelectItem>
                                    <SelectItem value="course">Course</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Product Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Product Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="htmlContent"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Custom HTML Content (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="<div>Custom HTML...</div>" className="font-mono" {...field} />
                            </FormControl>
                            <FormDescription>
                                If provided, this will replace the standard product layout.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Ebooks, Templates" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="format"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Format</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. PDF, DOCX" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="licenseType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Type</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. PLR, MRR" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isHidden"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Hide from Catalog?
                                </FormLabel>
                                <FormDescription>
                                    If checked, this product will not appear in the public products list (useful for upsells/thank you pages).
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isAmazonProduct"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Is this an Amazon Product?
                                </FormLabel>
                                <FormDescription>
                                    If checked, this product will link to Amazon instead of using GrooveSell.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                {form.watch("isAmazonProduct") ? (
                    <FormField
                        control={form.control}
                        name="amazonLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amazon Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://amazon.com/..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name="grooveSellId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GrooveSell Tracking ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 85437" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The ID from the tracking pixel URL.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="grooveSellEmbed"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GrooveSell Embed Code</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="<div...>" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The full embed code for the checkout/product.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Product"}
                </Button>
            </form>
        </Form>
    )
}
