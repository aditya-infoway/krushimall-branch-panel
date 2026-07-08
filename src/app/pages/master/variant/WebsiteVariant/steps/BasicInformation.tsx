// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useState } from "react";
// Local Imports
import { Button, Input, Textarea } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { BasicInformationSchema, BasicInformationType } from "../schema";
import { Listbox } from "@/components/shared/form/StyledListbox";
// ----------------------------------------------------------------------
import { DatePicker } from "@/components/shared/form/Datepicker";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import apiHelper from "@/utils/apiHelper";
// Options for various select fields
import { useEffect } from "react";




const tractorStatusOptions = [
  { label: "Available", value: "available" },
  { label: "Sold", value: "sold" },
  { label: "Pending", value: "pending" },
  { label: "In Transit", value: "in_transit" },
];

const colorOptions = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
];

const stockStatusOptions = [
  { label: "In Stock", value: "in_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
  { label: "Limited Stock", value: "limited_stock" },
  { label: "Pre-order", value: "pre_order" },
];

const dealerOptions = [
  { label: "Dealer 1", value: "dealer1" },
  { label: "Dealer 2", value: "dealer2" },
  { label: "Dealer 3", value: "dealer3" },
];


export function BasicInformation({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
resolver: yupResolver(BasicInformationSchema) as unknown as Resolver<BasicInformationType>,
    defaultValues: kycFormCtx.state.formData.BasicInformation,
  });
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  // const [district, setDistrict] = useState("");
  // const [stateCode, setStateCode] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [modelYears, setModelYears] = useState([]);

  const [variants, setVariants] = useState([]);
  const showCustomColorInput = watch("showCustomColor");
  const [highlightCount, setHighlightCount] = useState(5);
const onSubmit = async (
  data: BasicInformationType
) => {
  try {
    const payload = {
    categoryId: data.categoryId
    ? Number(data.categoryId)
    : null,

  brandId: data.brandId
    ? Number(data.brandId)
    : null,

  modelId: data.modelId
    ? Number(data.modelId)
    : null,

  modelYearId: data.modelYearId
    ? Number(data.modelYearId)
    : null,

  variantId: data.variantId
    ? Number(data.variantId)
    : null,

      variantCode: data.variantCode,
      productName: data.productName,
      productCode: data.productCode,
      skuCode: data.skuCode,

      launchYear: data.launchYear
  ? new Date(data.launchYear).toISOString()
  : null,

      country: data.country,
      tractorStatus: data.tractorStatus,

      shortDescription: data.shortDescription,

      highlight1: data.highlights?.highlight1,
      highlight2: data.highlights?.highlight2,
      highlight3: data.highlights?.highlight3,
      highlight4: data.highlights?.highlight4,
      highlight5: data.highlights?.highlight5,

      customColorName: data.customColorName,
      customColorCode: data.customColorCode,

      availableStates: data.availableStates,
      availableDistricts:
        data.availableDistricts,
      availableDealers:
        data.availableDealers,

      stockStatus: data.stockStatus,

      seoTitle: data.seoTitle,
      seoUrl: data.seoUrl,
      metaDescription:
        data.metaDescription,
      keywords: data.keywords,

      currentStep: 0,
    };

    const res = await apiHelper.post(
      "/website-variants",
      payload
    );

    const websiteVariantId =
      res.data.id;

    localStorage.setItem(
      "websiteVariantId",
      websiteVariantId.toString()
    );

   kycFormCtx.dispatch({
  type: "SET_FORM_DATA",
  payload: {
    BasicInformation: data,
  },
});

kycFormCtx.dispatch({
  type: "SET_STEP_STATUS",
  payload: {
    BasicInformation: {
      isDone: true,
    },
  },
});

setCurrentStep(1);

    setCurrentStep(1);
  } catch (error) {
    console.error(error);
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
 const selectedStates =
  watch("availableStates") || [];

const cityOptions = Array.isArray(selectedStates) 
  ? selectedStates.flatMap((stateCode: string) =>
      City.getCitiesOfState(country, stateCode).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      )
    )
  : [];

  const formatLocalDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  return new Date(dateStr + "T00:00:00");
};
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
  const categoryId = watch("categoryId");
  const brandId = watch("brandId");
  const modelId = watch("modelId");
  const modelYearId = watch("modelYearId");
  const filteredBrands = brands.filter(
    (item: any) => Number(item.categoryId) === Number(categoryId),
  );

  const filteredModels = models.filter(
    (item: any) => Number(item.brandId) === Number(brandId),
  );

  const filteredModelYears = modelYears.filter(
    (item: any) => Number(item.modelId) === Number(modelId),
  );

  const filteredVariants = variants.filter(
    (item: any) => Number(item.modelYearId) === Number(modelYearId),
  );
  useEffect(() => {
    loadMasters();
    console.log("loadMasters called");
  }, []);

  const loadMasters = async () => {
    try {
      const [categoryRes, brandRes, modelRes, modelYearRes, variantRes] =
        await Promise.all([
          apiHelper.get("/category"),

          apiHelper.get("/brand"),
          apiHelper.get("/model"),
          apiHelper.get("/model-year"),
          apiHelper.get("/variant"),
        ]);

      setCategories(categoryRes.data || categoryRes);
      setBrands(brandRes.data || brandRes);
      setModels(modelRes.data || modelRes);
      setModelYears(modelYearRes.data || modelYearRes);
      setVariants(variantRes.data || variantRes);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-6">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={categories}
                  value={
                    categories.find((item: any) => item.id === field.value) ||
                    null
                  }
                  onChange={(option: any) => {
                    field.onChange(option.id);

                    setValue("brandId", "");
                    setValue("modelId", "");
                    setValue("modelYearId", "");
                    setValue("variantId", "");
                    setValue("variantCode", "");
                  }}
                  displayField="categoryName"
                  placeholder="Select Category"
                  label="Select Category"
                />
              )}
            />
            {errors?.tractorCategory && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tractorCategory.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              name="brandId"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={filteredBrands}
                  value={
                    filteredBrands.find(
                      (item: any) => item.id === field.value,
                    ) || null
                  }
                  onChange={(option: any) => {
                    field.onChange(option.id);

                    setValue("modelId", "");
                    setValue("modelYearId", "");
                    setValue("variantId", "");
                    setValue("variantCode", "");
                  }}
                  displayField="brandName"
                  placeholder="Select Brand"
                  label="Select Brand"
                />
              )}
            />

            {errors?.brandName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.brandName.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="modelId"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={filteredModels}
                  value={
                    filteredModels.find(
                      (item: any) => item.id === field.value,
                    ) || null
                  }
                  onChange={(option: any) => {
                    field.onChange(option.id);

                    setValue("modelYearId", "");
                    setValue("variantId", "");
                    setValue("variantCode", "");
                  }}
                  displayField="modelName"
                  placeholder="Select Model"
                  label="Select Model"
                />
              )}
            />

            {errors?.modelName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.modelName.message}
              </p>
            )}
          </div>
          <Controller
            name="modelYearId"
            control={control}
            render={({ field }) => (
              <Listbox
                data={filteredModelYears}
                value={
                  filteredModelYears.find(
                    (item: any) => item.id === field.value,
                  ) || null
                }
                onChange={(option: any) => {
                  field.onChange(option.id);

                  setValue("variantId", "");
                  setValue("variantCode", "");
                }}
                displayField="modelYear"
                placeholder="Select Model Year"
                label="Select Model Year"
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Controller
              name="variantId"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={filteredVariants}
                  value={
                    filteredVariants.find(
                      (item: any) => item.id === field.value,
                    ) || null
                  }
                  onChange={(option: any) => {
                    field.onChange(option.id);

                    setValue("variantCode", option.variantCode || "");
                  }}
                  displayField="variantName"
                  placeholder="Select Variant"
                  label="Select Variant"
                />
              )}
            />
            {errors?.variantName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.variantName.message}
              </p>
            )}
          </div>
          <Input
            {...register("variantCode")}
            label="Variant Code"
            placeholder="Variant Code"
            disabled
          />
         <Controller
  name="launchYear"
  control={control}
  render={({ field }) => (
    <DatePicker
      value={field.value ? parseLocalDate(field.value) : undefined}
      onChange={(selectedDates: Date[]) => {
        field.onChange(formatLocalDate(selectedDates[0] || null));
      }}
      label="Launch Year"
      error={errors?.launchYear?.message}
      options={{ disableMobile: true }}
      placeholder="Select launch date..."
    />
  )}
/>
           <Input
            {...register("productName")}
            label="Website Display Product Name"
            placeholder="Enter product Name"
            error={errors?.productName?.message}
          />
          <Input
            {...register("productCode")}
            label="Product Code"
            placeholder="Enter product Code"
            error={errors?.productCode?.message}
          />

          <Input
            {...register("skuCode")}
            label="SKU Code"
            placeholder="Enter SKU code"
            error={errors?.skuCode?.message}
          />
           <div>
            <Controller
              name="tractorStatus"
              control={control}
              render={({ field }) => (
                <Listbox
                  data={tractorStatusOptions}
                  value={
                    tractorStatusOptions.find(
                      (item) => item.value === field.value,
                    ) || null
                  }
                  onChange={(option: any) => field.onChange(option?.value)}
                  displayField="label"
                  placeholder="Select Status"
                  label="Tractor Status"
                />
              )}
            />

            {errors?.tractorStatus && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tractorStatus.message}
              </p>
            )}
          </div>
        </div>

       

        {/* Short Description */}
        <div className="border-y border-gray-500 py-8">
          <Textarea
            {...register("shortDescription")}
            label="Short Description"
            placeholder="Write short description about this tractor (Max 200 characters)"
            maxLength={200}
            rows={3}
            error={errors?.shortDescription?.message}
           description="Max 200 characters"
          />
        </div>

        {/* Key Highlights Section */}
        <div className="border-y border-gray-500 py-8">
          <h3 className="mb-2 text-lg font-semibold text-gray-500">
            Key Highlights
          </h3>

          <p className="mb-6 text-sm text-gray-500">
            Add key highlights about this tractor
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: highlightCount }, (_, index) => (
              <Input
                key={index}
                {...register(`highlights.highlight${index + 1}` as any)}
                label={`Highlight ${index + 1}`}
                placeholder="Enter highlight"
              />
            ))}
          </div>

          <Button
            type="button"
            className="mt-4"
            onClick={() => setHighlightCount((prev) => prev + 1)}
          >
            + Add Another Highlight
          </Button>
        </div>

        {/* Available Colors Section */}
        <div className="border-y border-gray-500 py-8">
          <h3 className="mb-4 text-lg font-semibold">Available Colors</h3>
          <p className="mb-4 text-sm text-gray-500">
            Select available colors for this tractor
          </p>

          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <label key={color.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  // {...register(`colors.${color.value}`)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span
                  className="flex h-6 w-6 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.label}</span>
              </label>
            ))}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("colors.custom")}
                onChange={(e) => {
                  setValue("showCustomColor", e.target.checked);
                  register("colors.custom").onChange(e);
                }}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Custom</span>
            </label>
          </div>

          {showCustomColorInput && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Input
                {...register("customColorName")}
                label="Custom Color Name"
                placeholder="Enter custom color name"
                error={errors?.customColorName?.message}
              />

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Custom Color
                </label>

                <input
                  type="color"
                  {...register("customColorCode")}
                  className="h-10 w-20 cursor-pointer rounded border border-gray-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Dealer Availability Section */}
        <div className="">
          <h3 className="mb-4 text-lg font-semibold">Dealer Availability</h3>
          <p className="mb-4 text-sm text-gray-500">
            Select where this tractor is available
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                Available States <span className="text-red-500">*</span>
              </label>
              <Controller
                name="availableStates"
                control={control}
                render={({ field }) => (
                  <Select
                    options={stateOptions}
                    isMulti
                    styles={customSelectStyles}
                      classNamePrefix="react-select"
                    placeholder="Search State"
                    isDisabled={!country}
                    value={stateOptions.filter((option) =>
                      field.value?.includes(option.value),
                    )}
                    onChange={(selected: any) => {
                      field.onChange(
                        selected?.map((item: any) => item.value) || [],
                      );
                    }}
                  />
                )}
              />

              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple
              </p>

              {errors?.availableStates && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.availableStates.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Available Districts <span className="text-red-500">*</span>
              </label>
              <Controller
                name="availableDistricts"
                control={control}
                render={({ field }) => (
                  <Select
                    options={cityOptions}
                    isMulti
                    styles={customSelectStyles}
                      classNamePrefix="react-select"
                    placeholder="Search District"
                    isDisabled={!selectedStates.length}
                    value={cityOptions.filter((option) =>
                      field.value?.includes(option.value),
                    )}
                    onChange={(selected: any) => {
                      field.onChange(
                        selected?.map((item: any) => item.value) || [],
                      );
                    }}
                  />
                )}
              />
              
              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple
              </p>

              {errors?.availableDistricts && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.availableDistricts.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                {" "}
                Available Dealers <span className="text-red-500">*</span>{" "}
              </label>
              <Controller
                name="availableDealers"
                control={control}
                render={({ field }) => (
                  <Select
                    options={dealerOptions}
                    isMulti
                    styles={customSelectStyles}
                      classNamePrefix="react-select"
                    placeholder="Search Dealers"
                    value={dealerOptions.filter((option) =>
                      field.value?.includes(option.value),
                    )}
                    onChange={(selected: any) => {
                      field.onChange(
                        selected?.map((item: any) => item.value) || [],
                      );
                    }}
                  />
                )}
              />
              <p className="mt-1 text-xs text-gray-400">
                Hold Ctrl/Cmd to select multiple
              </p>

              {errors?.availableDealers && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.availableDealers.message}
                </p>
              )}
            </div>

            <div>
              <Controller
                name="stockStatus"
                control={control}
                render={({ field }) => (
                  <Listbox
                    data={stockStatusOptions}
                    value={
                      stockStatusOptions.find(
                        (item) => item.value === field.value,
                      ) || null
                    }
                    onChange={(option: any) => field.onChange(option?.value)}
                    displayField="label"
                    placeholder="Select Stock Status"
                    label="Stock Status"
                  />
                )}
              />
              {errors?.stockStatus && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stockStatus.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SEO Details Section */}
        <div className="border-y border-gray-500 py-8">
          <h3 className="mb-4 text-lg font-semibold">SEO Details</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Input
              {...register("seoTitle")}
              label="SEO Title"
              placeholder="Enter SEO title"
              error={errors?.seoTitle?.message}
            />

            <div>
              <Input
                {...register("seoUrl")}
                label="SEO URL"
                placeholder="Enter SEO URL"
                error={errors?.seoUrl?.message}
              />
              <p className="mt-1 text-xs text-gray-400">
                This will be used in the website URL
              </p>
            </div>

            <div>
              <Textarea
                {...register("metaDescription")}
                label="Meta Description"
                placeholder="Enter meta description"
                maxLength={160}
                rows={2}
                error={errors?.metaDescription?.message}
              />
              <p className="mt-1 text-xs text-gray-400">Max 160 characters</p>
            </div>

            <div>
              <Input
                {...register("keywords")}
                label="Keywords"
                placeholder="Enter keywords"
                error={errors?.keywords?.message}
              />
              <p className="mt-1 text-xs text-gray-400">
                Comma separated keywords
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <Button type="button" className="min-w-[7rem]">
          Cancel
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Save & Next
        </Button>
      </div>
    </form>
  );
}
