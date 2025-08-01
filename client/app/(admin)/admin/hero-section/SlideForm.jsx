"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUploader from "@/components/admin/products/ImageUploader";

const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageUrl: z
    .array(z.string())
    .min(1, "Please upload one image.")
    .max(1, "You can only upload one image."),
  linkUrl: z.string().min(1),
  buttonText: z.string().min(1),
  isActive: z.boolean(),
  displayOrder: z.coerce.number(),
});

export default function SlideForm({ onSubmit, slide, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: slide?.title || "",
      description: slide?.description || "",
      imageUrl: slide?.imageUrl ? [slide.imageUrl] : [],
      linkUrl: slide?.linkUrl || "/",
      buttonText: slide?.buttonText || "Shop Now",
      isActive: slide?.isActive !== undefined ? slide.isActive : true,
      displayOrder: slide?.displayOrder || 0,
    },
  });

  const handleSubmit = (values) => {
    // We transform the imageUrl from an array back to a string for the DB
    onSubmit({ ...values, imageUrl: values.imageUrl[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{slide ? "Edit Slide" : "Create New Slide"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              name="imageUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                      multiple={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="linkUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL (e.g., /#product-grid)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="buttonText"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="displayOrder"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order (0 is first)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Active</FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Slide"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
