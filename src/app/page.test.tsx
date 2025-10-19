import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";
import { Toaster } from "~/components/ui/sonner";

vi.mock("~/lib/actions", () => ({
  createShipmentLabel: vi.fn(),
}));

const { createShipmentLabel } = await import("~/lib/actions");

describe("Home form flow", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.stubGlobal("open", vi.fn());
    vi.clearAllMocks();
  });

  it("submits and opens new tab if we got a label URL", async () => {
    // @ts-expect-error mocked
    createShipmentLabel.mockResolvedValue({ data: "https://label.test" });
    render(<Home />);

    const btn = screen.getByRole("button", { name: /next/i });
    await userEvent.click(btn);
    const btn2 = screen.getByRole("button", { name: /next/i });
    await userEvent.click(btn2);
    const submitBtn = screen.getByRole("button", {
      name: /create usps label/i,
    });
    await userEvent.click(submitBtn);

    expect(createShipmentLabel).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith("https://label.test", "_blank");
  });

  it("does not open new tab if we got an error and shows a toast", async () => {
    // @ts-expect-error mocked
    createShipmentLabel.mockResolvedValue({ error: "No USPS rate found" });
    render(
      <>
        <Home />
        <Toaster />
      </>
    );

    const btn = screen.getByRole("button", { name: /next/i });
    await userEvent.click(btn);
    const btn2 = screen.getByRole("button", { name: /next/i });
    await userEvent.click(btn2);
    const submitBtn = screen.getByRole("button", {
      name: /create usps label/i,
    });
    await userEvent.click(submitBtn);

    expect(createShipmentLabel).toHaveBeenCalledTimes(1);
    expect(open).not.toHaveBeenCalled();

    const toast = await screen.findByText(
      /something went wrong creating the label\. please try again\./i
    );
    expect(toast).toBeVisible();
  });

  it("blocks first step next button if we have invalid form data", async () => {
    render(<Home />);

    const nameInput = screen.getByLabelText(/name/i);

    await userEvent.clear(nameInput);

    const btn = screen.getByRole("button", { name: /next/i });

    expect(btn).toBeDisabled();
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });

  it("blocks second step next button if we have invalid form data", async () => {
    render(<Home />);

    // Go to second step
    const btn = screen.getByRole("button", { name: /next/i });
    await userEvent.click(btn);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.clear(nameInput);

    const nextBtn = screen.getByRole("button", { name: /next/i });

    expect(nextBtn).toBeDisabled();
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  });
});
