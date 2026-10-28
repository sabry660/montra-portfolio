"use client";

import { useMemo, useState } from "react";
import { SITE_CONTENT } from "@/data/siteContent";
import { ArrowRight } from "lucide-react";

export default function PricingSection() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  const selectedPackageData = useMemo(
    () => SITE_CONTENT.packages.find((packageOption) => packageOption.id === selectedPackage) ?? null,
    [selectedPackage]
  );

  const selectedAddOnList = useMemo(
    () => SITE_CONTENT.addOns.filter((addOn) => selectedAddOns.has(addOn.id)),
    [selectedAddOns]
  );

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((previous) => {
      const updated = new Set(previous);
      if (updated.has(addOnId)) updated.delete(addOnId);
      else updated.add(addOnId);
      return updated;
    });
  };

  const calculateSubtotal = () => {
    if (!selectedPackageData) return 0;

    let subtotal = selectedPackageData.price;

    selectedAddOnList.forEach((addOn) => {
      if (addOn.pricingModel === "fixed") {
        subtotal += addOn.price;
      }

      if (addOn.pricingModel === "percentage" && addOn.percentageValue) {
        subtotal += subtotal * (addOn.percentageValue / 100);
      }
    });

    return Math.round(subtotal);
  };

  const calculateTotal = () => {
    if (!selectedPackageData) return 0;

    const fixedAndPercentageTotal = selectedAddOnList.reduce((sum, addOn) => {
      if (addOn.pricingModel === "fixed") return sum + addOn.price;
      if (addOn.pricingModel === "percentage" && addOn.percentageValue) {
        const applicableBase = selectedPackageData.price + sum;
        return sum + applicableBase * (addOn.percentageValue / 100);
      }
      return sum;
    }, selectedPackageData.price);

    return Math.round(fixedAndPercentageTotal);
  };

  const getAddOnDisplayValue = (addOn: (typeof SITE_CONTENT.addOns)[number]) => {
    if (addOn.pricingModel === "percentage") {
      return `+${addOn.price}%`;
    }

    if (addOn.pricingModel === "starting") {
      return `From EGP ${addOn.price.toLocaleString()}`;
    }

    return `EGP ${addOn.price.toLocaleString()}`;
  };

  const handleRequestEstimate = () => {
    if (!selectedPackageData) {
      window.alert("Please select a package before requesting an estimate.");
      return;
    }

    const selectedPackageName = selectedPackageData.name;
    const packagePrice = selectedPackageData.price;
    const addOnSummary = selectedAddOnList.length
      ? selectedAddOnList
          .map((addOn) => `${addOn.name}: ${getAddOnDisplayValue(addOn)}`)
          .join("\n")
      : "No add-ons selected.";
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    const discount = Math.max(0, subtotal - total);

    const message = [
      "Hello Mohamed Sabry,",
      "",
      "I’d like to request an estimate from Montra.",
      "",
      `Selected Package: ${selectedPackageName}`,
      `Package Price: EGP ${packagePrice.toLocaleString()}`,
      "",
      "Selected Add-ons:",
      addOnSummary,
      "",
      `Subtotal: EGP ${subtotal.toLocaleString()}`,
      `Discount: EGP ${discount.toLocaleString()}`,
      `Total Estimate: EGP ${total.toLocaleString()}`,
      "",
      "I’d like to discuss the details and confirm the next steps.",
      "",
      "Best regards,",
      "Montra",
    ].join("\n");

    const whatsappNumber = SITE_CONTENT.contact.whatsapp || "";
    if (!whatsappNumber) {
      window.alert("WhatsApp number is not configured.");
      return;
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="pricing" className="py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p
            className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-accent"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pricing
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
            data-cursor="text"
          >
            Choose Your Package
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text/60">
            All prices in EGP. Select a package and add-ons to get an estimate.
          </p>
        </div>

        <div className="mb-16 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_CONTENT.packages.map((pkg) => (
            <div
              key={pkg.id}
              data-reveal="up"
              className={`relative flex flex-col border p-8 transition-all ${
                selectedPackage === pkg.id
                  ? "border-accent bg-accent/5"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                {pkg.name}
              </h3>
              <p className="mb-4 text-sm text-text/60">{pkg.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">EGP {pkg.price.toLocaleString()}</span>
              </div>
              <ul className="mb-6 flex-1 space-y-2 text-sm text-text/70">
                {pkg.includedFeatures.map((feature, index) => (
                  <li key={`${pkg.id}-${index}`} className="flex items-start gap-2">
                    <span className="mt-1 text-accent">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full py-3 font-semibold transition-colors ${
                  selectedPackage === pkg.id
                    ? "bg-accent text-black"
                    : "border border-white/20 hover:border-accent hover:text-accent"
                }`}
              >
                {selectedPackage === pkg.id ? "Selected" : pkg.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        {selectedPackageData && (
          <div className="border border-white/10 bg-white/[0.02] p-8">
            <h3 className="mb-6 text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Add-ons
            </h3>

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SITE_CONTENT.addOns.map((addOn) => (
                <label
                  key={addOn.id}
                  className={`flex cursor-pointer items-start gap-3 rounded border p-4 transition-all ${
                    selectedAddOns.has(addOn.id)
                      ? "border-accent bg-accent/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAddOns.has(addOn.id)}
                    onChange={() => toggleAddOn(addOn.id)}
                    className="mt-1 h-4 w-4 accent-accent"
                  />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-semibold">{addOn.name}</span>
                      <span className="text-sm text-accent">{getAddOnDisplayValue(addOn)}</span>
                    </div>
                    <p className="text-xs text-text/60">{addOn.description}</p>
                    {addOn.notes && <p className="mt-1 text-xs text-text/40 italic">{addOn.notes}</p>}
                  </div>
                </label>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="mb-4 space-y-2">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text/60">Base Package:</span>
                  <span>EGP {selectedPackageData.price.toLocaleString()}</span>
                </div>
                {selectedAddOnList.map((addOn) => (
                  <div key={addOn.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-text/60">{addOn.name}:</span>
                    <span>{getAddOnDisplayValue(addOn)}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-lg font-bold">Estimated Total:</span>
                <span className="text-2xl font-bold text-accent">EGP {calculateTotal().toLocaleString()}</span>
              </div>

              {selectedAddOnList.some((addOn) => addOn.pricingModel === "starting") && (
                <p className="mb-4 text-xs text-text/40">
                  * Prices marked as “From” are indicative and require final confirmation based on scope.
                </p>
              )}

              <button type="button" onClick={handleRequestEstimate} className="hero-cta w-full justify-center">
                <span>Request This Estimate</span>
                <ArrowRight size={16} className="hero-cta-arrow" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
