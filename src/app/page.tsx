"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { createShipmentLabel } from "~/lib/actions";
import { AddressFieldSet } from "./address-field-set";

const addressSchema = z.object({
  name: z.string().min(1),
  street1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  phone: z.string().optional(),
  street2: z.string().optional(),
});

const formSchema = z.object({
  fromAddress: addressSchema,
  toAddress: addressSchema,
  parcel: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    weight: z.number(),
  }),
});

export type ShipmentFormData = z.infer<typeof formSchema>;

export default function Home() {
  const form = useForm<ShipmentFormData>({
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
      return;
      // TODO: Handle error
    }

    window.open(url, "_blank");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardContent>
            <AddressFieldSet legend="Sender" type="fromAddress" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <AddressFieldSet legend="Recipient" type="toAddress" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <FieldSet>
              <FieldLegend>Package</FieldLegend>
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
        </Card>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loader2Icon /> : "Create USPS Label"}
        </Button>
      </form>
    </FormProvider>
  );
}
