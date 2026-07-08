// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import { useState } from "react";

// Local Imports
import { Button } from "@/components/ui";
import { useKYCFormContext } from "../KYCFormContext";
import { MediaDocumnetSchema, MediaDocumnetType } from "../schema";
import { Upload, Trash2, FileText } from "lucide-react";
// ----------------------------------------------------------------------
import apiHelper from "@/utils/apiHelper";
// Image upload fields
const imageUploads = [
  { key: "frontView", label: "Front View", required: true },
  { key: "leftView", label: "Left View", required: true },
  { key: "rightView", label: "Right View", required: true },
  { key: "rearView", label: "Rear View", required: true },
  { key: "engineView", label: "Engine View", required: true },
  { key: "dashboardView", label: "Dashboard View", required: true },
  { key: "tyreView", label: "Tyre View", required: true },
  { key: "hydraulicView", label: "Hydraulic View", required: true },
  { key: "ptoView", label: "PTO View", required: true },
  { key: "chassisNumber", label: "Chassis Number", required: true },
  { key: "rcBook", label: "RC Book", required: true },
  { key: "additionalImage1", label: "Additional Image 1", required: false },
  { key: "additionalImage2", label: "Additional Image 2", required: false },
  { key: "additionalImage3", label: "Additional Image 3", required: false },
  { key: "additionalImage4", label: "Additional Image 4", required: false },
  { key: "additionalImage5", label: "Additional Image 5", required: false },
];

// Video upload fields
// const videoUploads = [
//   { key: "walkaroundVideo", label: "Walkaround Video" },
//   { key: "engineStartVideo", label: "Engine Start Video" },
//   { key: "ptoDemoVideo", label: "PTO Demo Video" },
//   { key: "hydraulicDemoVideo", label: "Hydraulic Demo Video" },
// ];

// Document upload fields
const documentUploads = [
  { key: "brochure", label: "Brochure / Spec Sheet", required: true },
  { key: "warrantyCard", label: "Warranty Card", required: true },
  {
    key: "insuranceCertificate",
    label: "Insurance Certificate",
    required: true,
  },
  { key: "invoice", label: "Invoice", required: true },
  { key: "others", label: "Others (Optional)", required: false },
];

export function MediaDocumnet({
  setCurrentStep,
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const kycFormCtx = useKYCFormContext();
  const [loading, setLoading] = useState(false);
  // const [youtubeLinks, setYoutubeLinks] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [documents, setUploadedDocs] = useState<Record<string, File | null>>(
    {},
  );
  const {
    // register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MediaDocumnetType>({
   resolver: yupResolver(MediaDocumnetSchema) as unknown as Resolver<MediaDocumnetType>,
    defaultValues: kycFormCtx.state.formData.MediaDocumnet,
  });

  const handleFileChange = (key: string, file: File | null) => {
    if (!file) return;

    setValue(key as any, file);

    // Store file for document name preview
    setUploadedDocs((prev) => ({
      ...prev,
      [key]: file,
    }));

    // Image preview only
    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);

      setPreviews((prev) => ({
        ...prev,
        [key]: previewUrl,
      }));
    }
  };
  const removeImage = (key: string) => {
    setValue(key as any, null);

    setPreviews((prev) => ({
      ...prev,
      [key]: "",
    }));
  };
  const removeDocument = (key: string) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [key]: null,
    }));

    setValue(key as any, null);
  };
  // const handleYoutubeLinkChange = (key: string, link: string) => {
  //   setYoutubeLinks((prev) => ({ ...prev, [key]: link }));
  //   setValue(`${key}Link` as any, link);
  // };

 const onSubmit = async (
  data: MediaDocumnetType
) => {
  try {
    setLoading(true);

    const websiteVariantId =
      localStorage.getItem("websiteVariantId");

    if (!websiteVariantId) return;

    const formData = new FormData();

    Object.entries(data).forEach(
      ([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        }
      }
    );

  

await apiHelper.put(
  `/website-variants/${websiteVariantId}/save-step`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: {
        MediaDocumnet: data,
      },
    });

    kycFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: {
        MediaDocumnet: {
          isDone: true,
        },
      },
    });

    setCurrentStep(6);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const handleSaveDraft = () => {
    const formData = watch();
    kycFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { MediaDocumnet: { ...formData } },
    });
    // Show toast notification here if needed
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-8">
        {/* Images Upload Section */}
        <div className="">
          <h3 className="mb-2 text-lg font-semibold">Images Upload</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload images of your tractor from different angles
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {imageUploads.map((image) => (
              <div key={image.key}>
                <label className="mb-2 block text-sm font-medium">
                  {image.label}
                  {image.required && <span className="text-red-500">*</span>}
                </label>

                <div className="relative h-50 overflow-hidden rounded-lg border border-dashed border-gray-600">
                  {previews[image.key] ? (
                    <>
                      <img
                        src={previews[image.key]}
                        alt={image.label}
                        className="h-50 w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(image.key)}
                        className="bg-primary-500 absolute top-2 right-2 rounded p-1 text-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <label className="flex h-50 cursor-pointer flex-col items-center justify-center">
                      <Upload className="text-primary-500 h-8 w-8" />

                      <span className="text-primary-500 text-sm">
                        Upload Image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(
                            image.key,
                            e.target.files?.[0] || null,
                          )
                        }
                      />
                    </label>
                  )}
                </div>

                {errors[image.key as keyof MediaDocumnetType] && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      errors[image.key as keyof MediaDocumnetType]
                        ?.message as string
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Videos Uploads Section */}
        {/* <div className="rounded-lg border border-gray-200 p-4">
          <h3 className="mb-2 text-lg font-semibold">Videos Uploads</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload videos or add YouTube link (Optional)
          </p>
       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {videoUploads.map((video) => (
              <div key={video.key} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <h4 className="mb-3 font-medium text-gray-700">{video.label}</h4>
                <div className=" flex flex-col">
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Upload Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(video.key, e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      or Paste YouTube link
                    </label>
                    <Input
                      placeholder="https://youtube.com/..."
                      value={youtubeLinks[video.key] || ""}
                      onChange={(e) => handleYoutubeLinkChange(video.key, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Supported formats: MP4, MOV, AVI (Max size: 50MB)
          </p>
        </div> */}
<div className="mb-8 border-b border-gray-600" />
        {/* Documents Uploads Section */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Documents Uploads</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload tractor related documents
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {documentUploads.map((doc) => (
              <div key={doc.key}>
                <label className="mb-2 block text-sm font-medium">
                  {doc.label}
                  {doc.required && <span className="text-red-500">*</span>}
                </label>

                <div className="relative rounded-lg border border-dashed border-gray-600">
                  {documents?.[doc.key] ? (
                    <div className="flex h-32 flex-col items-center justify-center p-2 text-center">
                      <FileText className="mb-2 h-8 w-8 text-primary-500" />

                      <p className="max-w-full truncate text-xs font-medium text-primary-500">
                        {documents[doc.key]?.name}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-500">
                        PDF Uploaded
                      </p>
                    </div>
                  ) : (
                    <label className="flex h-32 cursor-pointer flex-col items-center justify-center">
                      <FileText className="mb-2 h-8 w-8 text-primary-500" />

                      <span className="text-sm font-medium text-primary-500">
                        Upload PDF
                      </span>

                      <span className="mt-1 text-xs text-gray-500">
                        Max size: 5MB
                      </span>

                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(doc.key, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  )}
                </div>

                {errors[doc.key as keyof MediaDocumnetType] && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      errors[doc.key as keyof MediaDocumnetType]
                        ?.message as string
                    }
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Supported format: PDF (Max size: 5MB)
          </p>
        </div>
        {/* Required Fields Note */}
        <div className="text-sm text-gray-500">
          * Marked fields are mandatory
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outlined"
          className="min-w-[7rem]"
          onClick={() => setCurrentStep(4)}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outlined"
            className="min-w-[7rem]"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            className="min-w-[7rem]"
            color="primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Next"}
          </Button>
        </div>
      </div>
    </form>
  );
}
