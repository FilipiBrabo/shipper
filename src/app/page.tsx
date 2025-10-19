"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  PackageIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { createShipmentLabel } from "~/lib/actions";
import { AddressFieldSet } from "./address-field-set";
import { toast } from "sonner";

const addressSchema = z.object({
  name: z.string().trim().min(1, { error: "Name is required" }),
  street1: z.string().trim().min(1, { error: "Street address is required" }),
  city: z.string().trim().min(1, { error: "City is required" }),
  state: z.string().trim().min(1, { error: "State is required" }),
  zip: z.string().trim().min(1, { error: "Postal code is required" }),
  phone: z.string().trim().optional(),
  street2: z.string().trim().optional(),
});

const formSchema = z.object({
  fromAddress: addressSchema,
  toAddress: addressSchema,
  parcel: z.object({
    length: z
      .number({ error: "Length is required" })
      .positive({ message: "Length must be greater than 0" }),
    width: z
      .number({ error: "Width is required" })
      .positive({ message: "Width must be greater than 0" }),
    height: z
      .number({ error: "Height is required" })
      .positive({ message: "Height must be greater than 0" }),
    weight: z
      .number({ error: "Weight is required" })
      .positive({ message: "Weight must be greater than 0" }),
  }),
});

export type ShipmentFormData = z.infer<typeof formSchema>;

export default function Home() {
  const [tab, setTab] = useState<"sender" | "recipient" | "package">("sender");

  const form = useForm<ShipmentFormData>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAddress: {
        name: "John Doe",
        street1: "417 MONTGOMERY ST",
        street2: "FLOOR 5",
        city: "SAN FRANCISCO",
        state: "CA",
        zip: "94104",
      },
      toAddress: {
        name: "Dr. Steve Brule",
        street1: "179 N Harbor Dr",
        city: "Redondo Beach",
        state: "CA",
        zip: "90277",
        phone: "4155559999",
      },
      parcel: {
        length: 8,
        width: 5,
        height: 5,
        weight: 5,
      },
    },
  });

  const onSubmit = async (data: ShipmentFormData) => {
    const { data: url, error } = await createShipmentLabel(data);

    if (error || !url) {
      toast.error("Something went wrong creating the label. Please try again.");
      return;
    }

    window.open(url, "_blank");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={tab}>
          <TabsList className="w-full">
            <TabsTrigger value="sender">
              <UserIcon />
              Sender
            </TabsTrigger>
            <TabsTrigger value="recipient">
              <UserCheckIcon />
              Recipient
            </TabsTrigger>
            <TabsTrigger value="package">
              <PackageIcon />
              Package
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sender">
            <Card>
              <CardContent>
                <AddressFieldSet
                  legend={
                    <div className="flex items-center gap-2">
                      <UserIcon className="size-5" /> Sender
                    </div>
                  }
                  type="fromAddress"
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="ml-auto"
                  type="button"
                  disabled={!!form.formState.errors["fromAddress"]}
                  onClick={async () => {
                    const isValid = await form.trigger("fromAddress", {
                      shouldFocus: true,
                    });
                    if (isValid) {
                      setTab("recipient");
                    }
                  }}
                >
                  Next
                  <ArrowRightIcon />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="recipient">
            <Card>
              <CardContent>
                <AddressFieldSet
                  legend={
                    <div className="flex items-center gap-2">
                      <UserCheckIcon className="size-5" /> Recipient
                    </div>
                  }
                  type="toAddress"
                />
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setTab("sender")}
                >
                  <ArrowLeftIcon />
                  Previous
                </Button>
                <Button
                  className="ml-auto"
                  type="button"
                  disabled={!!form.formState.errors["toAddress"]}
                  onClick={async () => {
                    const isValid = await form.trigger("toAddress");
                    if (isValid) {
                      setTab("package");
                    }
                  }}
                >
                  Next
                  <ArrowRightIcon />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="package">
            <Card>
              <CardContent>
                <FieldSet>
                  <FieldLegend className="flex items-center gap-2">
                    <PackageIcon className="size-5" />
                    Package
                  </FieldLegend>
                  <FieldGroup>
                    <Controller
                      name="parcel.length"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Length (in)</FieldLabel>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="parcel.width"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Width (in)</FieldLabel>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="parcel.height"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Height (in)</FieldLabel>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="parcel.weight"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Weight (oz)</FieldLabel>
                          <Input
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                              )
                            }
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setTab("recipient")}
                >
                  <ArrowLeftIcon />
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={
                    form.formState.isSubmitting ||
                    !!form.formState.errors["parcel"]
                  }
                >
                  {form.formState.isSubmitting ? (
                    <Loader2Icon />
                  ) : (
                    "Create USPS Label"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}
