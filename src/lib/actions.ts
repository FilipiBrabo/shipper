"use server";

import type { Shipment } from "@easypost/api";
import type { ShipmentFormData } from "~/app/page";
import { easyPost } from "~/lib/easy-post";

// TODO: better return type. If we return error, data should be undefined/null. This should be enforced by the type system.
export async function createShipmentLabel(data: ShipmentFormData) {
  let shipment: Shipment | undefined;

  try {
    shipment = await easyPost.Shipment.create({
      from_address: { ...data.fromAddress, country: "US" },
      to_address: { ...data.toAddress, country: "US" },
      parcel: data.parcel,
    });
  } catch (error) {
    console.error("Error creating shipment", error);
    return { error: "Error creating shipment" };
  }

  const lowestRate = shipment.lowestRate(["USPS"]);
  if (!lowestRate) {
    console.error("No USPS rate found", { data: shipment });
    return { error: "No USPS rate found" };
  }

  try {
    const purchase = await easyPost.Shipment.buy(shipment.id, lowestRate);
    const url = purchase.postage_label?.label_url;
    if (!url) {
      console.error("No label URL returned", { data: purchase });
      return { error: "No label URL returned" };
    }

    return { data: url };
  } catch (error) {
    console.error("Error buying shipment", error);
    return { error: "Error buying shipment" };
  }
}
