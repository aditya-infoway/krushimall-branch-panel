// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useState } from "react";
// Local Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Button, Input } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { PriceLocationSchema, PriceLocationType } from "../schema";
import { Listbox } from "@/components/shared/form/StyledListbox";
// ----------------------------------------------------------------------
import { MapPinned } from "lucide-react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
// Options for select fields
import apiHelper from "@/utils/apiHelper";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const latlng = marker.getLatLng();

          setPosition([latlng.lat, latlng.lng]);
        },
      }}
    />
  );
}
export function PriceLocation({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();
  const [position, setPosition] = useState<[number, number]>([
    22.3039, 70.8022,
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<PriceLocationType>({
    resolver: yupResolver(PriceLocationSchema) as Resolver<PriceLocationType>,
    defaultValues: kycFormCtx.state.formData.PriceLocation,
  });

  const showTcs = watch("tcsApplicable");
  const showOfferPrice = watch("negotiable");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateCode, setStateCode] = useState("");
  const onSubmit = async (
  data: PriceLocationType
) => {
  try {
    const websiteVariantId =
      localStorage.getItem("websiteVariantId");

    if (!websiteVariantId) {
      return;
    }

    const payload = {
      exShowroomPrice: data.exShowroomPrice
        ? Number(data.exShowroomPrice)
        : null,

      onRoadPrice: data.onRoadPrice
        ? Number(data.onRoadPrice)
        : null,

      currency: data.currency,

      gst: data.gst
        ? Number(data.gst)
        : null,

      tcsApplicable:
        data.tcsApplicable,

      tcsPercentage:
        data.tcsPercentage
          ? Number(data.tcsPercentage)
          : null,

      financeAvailable:
        data.financeAvailable,

      emiAvailable:
        data.emiAvailable,

      downPayment:
        data.downPayment
          ? Number(data.downPayment)
          : null,

      exchangeOffer:
        data.exchangeOffer,

      offerPrice:
        data.offerPrice
          ? Number(data.offerPrice)
          : null,

      negotiable:
        data.negotiable,

      country: data.country,
      state: data.state,
      district: data.district,
      taluka: data.taluka,
      city: data.city,

      pincode: data.pincode,
      landmark: data.landmark,
      fullAddress:
        data.fullAddress,

      latitude: position[0],
      longitude: position[1],

      currentStep: 5,
    };

    await apiHelper.put(
      `/website-variants/${websiteVariantId}/save-step`,
      payload
    );

    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        PriceLocation: data,
      },
    });

    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        PriceLocation: {
          isDone: true,
        },
      },
    });

    setCurrentStep(5);
  } catch (error) {
    console.error(
      "Price Location Save Error:",
      error
    );
  }
};
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));
  const stateOptions = State.getStatesOfCountry(country).map((state) => ({
    value: state.isoCode,
    label: state.name,
    state,
  }));
  const cityOptions = City.getCitiesOfState(country, state).map((city) => ({
    value: city.name,
    label: city.name,
  }));
  const tcsApplicableOptions = [
    { label: "Select", value: "" },
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      borderColor: state.isFocused
        ? "var(--color-primary-600)"
        : "var(--color-gray-300)",
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--color-primary-600)"
        : "none",
      minHeight: "42px",

      "&:hover": {
        borderColor: "var(--color-primary-500)",
      },
    }),

    valueContainer: (provided: any) => ({
      ...provided,
      color: "var(--color-dark-100)",
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--color-dark-100)",
    }),

    input: (provided: any) => ({
      ...provided,
      color: "var(--color-dark-100)",
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: "var(--color-gray-400)",
    }),

    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--color-dark-700)",
      border: "1px solid var(--color-primary-600)",
      borderRadius: "12px",
      overflow: "hidden",
    }),

    menuList: (provided: any) => ({
      ...provided,
      padding: 0,
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--color-primary-600)"
        : state.isFocused
          ? "var(--color-primary-500)"
          : "var(--color-dark-700)",
      color: "#fff",
      cursor: "pointer",
    }),

    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused
        ? "var(--color-primary-600)"
        : "var(--color-gray-400)",
    }),

    clearIndicator: (provided: any) => ({
      ...provided,
      color: "var(--color-gray-400)",
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-8">
        {/* Pricing Details Section */}
        <div className="rounded-lg border border-gray-700 p-4">
          <h3 className="mb-2 text-lg font-semibold">Pricing Details</h3>
          <p className="mb-4 text-sm text-gray-500">
            Please enter pricing and finance information
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Ex-Showroom Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  {...register("exShowroomPrice")}
                  type="number"
                  placeholder="Enter price"
                  className="pl-8"
                  error={errors?.exShowroomPrice?.message}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                On-Road Price{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  {...register("onRoadPrice")}
                  type="number"
                  placeholder="Enter on-road price"
                  className="pl-8"
                  error={errors?.onRoadPrice?.message}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Currency <span className="text-red-500">*</span>
              </label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={[
                      { label: "INR - Indian Rupee", value: "INR" },
                      { label: "USD - US Dollar", value: "USD" },
                      { label: "EUR - Euro", value: "EUR" },
                      { label: "GBP - British Pound", value: "GBP" },
                    ]}
                    value={
                      [
                        { label: "INR - Indian Rupee", value: "INR" },
                        { label: "USD - US Dollar", value: "USD" },
                        { label: "EUR - Euro", value: "EUR" },
                        { label: "GBP - British Pound", value: "GBP" },
                      ].find((item) => item.value === field.value) || null
                    }
                    onChange={(option: any) => field.onChange(option?.value)}
                    displayField="label"
                    placeholder="Select Currency"
                  />
                )}
              />

              {errors?.currency && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.currency.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">GST (%)</label>
              <Input
                {...register("gst")}
                type="number"
                placeholder="GST %"
                defaultValue="18"
                suffix="%"
                error={errors?.gst?.message}
              />
            </div>

            <div>
              <Controller
                name="tcsApplicable"
                control={control}
                render={({ field }) => (
                  <Listbox
                    label="TCS Applicable"
                    data={tcsApplicableOptions}
                    value={
                      tcsApplicableOptions.find(
                        (item) => item.value === field.value,
                      ) || null
                    }
                    onChange={(option: any) => field.onChange(option?.value)}
                    displayField="label"
                    placeholder="Select"
                  />
                )}
              />

              {errors?.tcsApplicable && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.tcsApplicable.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                TCS (%) <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("tcsPercentage")}
                type="number"
                placeholder="Enter TCS %"
                error={errors?.tcsPercentage?.message}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Finance Available <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("financeAvailable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("financeAvailable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors?.financeAvailable && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.financeAvailable.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                EMI Available <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("emiAvailable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("emiAvailable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors?.emiAvailable && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emiAvailable.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Down Payment{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  {...register("downPayment")}
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8"
                  error={errors?.downPayment?.message}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Exchange Offer
              </label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("exchangeOffer")}
                  />
                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("exchangeOffer")}
                  />
                  <span>No</span>
                </label>
              </div>

              {errors?.exchangeOffer && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.exchangeOffer.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Offer Price{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  {...register("offerPrice")}
                  type="number"
                  placeholder="Enter offer price"
                  className="pl-8"
                  error={errors?.offerPrice?.message}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Negotiable
              </label>
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="yes"
                    {...register("negotiable")}
                    className="h-4 w-4"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    value="no"
                    {...register("negotiable")}
                    className="h-4 w-4"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="rounded-lg border border-gray-700 p-4">
          <div className="mb-4 flex items-start gap-3">
            <MapPinned className="mt-1 h-5 w-5 text-red-500" />

            <div>
              <h3 className="text-lg font-semibold">Location Details</h3>

              <p className="text-sm text-gray-500">
                Help buyers find your tractor easily
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 inline-block">Country</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    options={countryOptions}
                    classNamePrefix="react-select"
                    styles={customSelectStyles}
                    placeholder="Search Country"
                    value={
                      countryOptions.find(
                        (option) => option.value === field.value,
                      ) || null
                    }
                    onChange={(selected) => {
                      field.onChange(selected?.value || "");
                      setCountry(selected?.value || "");
                      setState("");
                      setCity("");
                    }}
                  />
                )}
              />
              {errors.country && (
                <p className="text-error dark:text-error-lighter mt-1 text-xs">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                State <span className="text-red-500">*</span>
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Select
                    options={stateOptions}
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                    placeholder="Search State"
                    isDisabled={!country}
                    value={
                      stateOptions.find(
                        (option) => option.value === field.value,
                      ) || null
                    }
                    onChange={(selected: any) => {
                      field.onChange(selected?.value || "");

                      setState(selected?.value || "");
                      setDistrict("");
                    }}
                  />
                )}
              />

              {errors?.state && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.state.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                District <span className="text-red-500">*</span>
              </label>
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Select
                    options={cityOptions}
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                    placeholder="Search District"
                    isDisabled={!state}
                    value={
                      cityOptions.find(
                        (option) => option.value === field.value,
                      ) || null
                    }
                    onChange={(selected: any) => {
                      field.onChange(selected?.value || "");
                      setDistrict(selected?.value || "");
                    }}
                  />
                )}
              />

              {errors?.district && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Taluka / Tehsil
              </label>

              <Controller
                name="taluka"
                control={control}
                render={({ field }) => (
                  <Select
                    options={cityOptions}
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                    placeholder="Search Taluka"
                    isDisabled={!district}
                    value={
                      cityOptions.find(
                        (option) => option.value === field.value,
                      ) || null
                    }
                    onChange={(selected: any) => {
                      field.onChange(selected?.value || "");
                    }}
                  />
                )}
              />

              {errors?.taluka && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.taluka.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Village / City <span className="text-red-500">*</span>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    options={cityOptions}
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                    placeholder="Search Village / City"
                    isDisabled={!state}
                    value={
                      cityOptions.find(
                        (option) => option.value === field.value,
                      ) || null
                    }
                    onChange={(selected: any) => {
                      field.onChange(selected?.value || "");
                    }}
                  />
                )}
              />

              {errors?.city && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Pincode <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("pincode")}
                type="number"
                placeholder="Enter pincode"
                error={errors?.pincode?.message}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Landmark{" "}
                <span className="text-xs text-gray-400">(Optional)</span>
              </label>
              <Input
                {...register("landmark")}
                placeholder="Enter landmark"
                error={errors?.landmark?.message}
              />
            </div>
          </div>

          {/* Full Address Section */}
          <div className="mt-5 mb-5">
            <h3 className="mb-2 text-lg font-semibold">Full Address</h3>
            <p className="mb-4 text-sm text-gray-500">
              Enter full address of your location
            </p>
            <textarea
              {...register("fullAddress")}
              rows={3}
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-700 p-2.5"
              placeholder="Enter complete address..."
            />
            {errors?.fullAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullAddress.message}
              </p>
            )}
          </div>

          {/* Map Location Section */}
          <div className="">
            <h3 className="mb-2 text-lg font-semibold">Map Location</h3>
            <p className="mb-4 text-sm text-gray-500">
              Drag the pin to exact location of your tractor
            </p>

            {/* Map placeholder - you can integrate Google Maps or any other mapping library here */}
            <div className="overflow-hidden rounded-lg border border-gray-700">
              <MapContainer
                center={position}
                zoom={11}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outlined"
          className="min-w-[7rem]"
          onClick={() => setCurrentStep(3)}
        >
          Previous
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Save & Next
        </Button>
      </div>
    </form>
  );
}
