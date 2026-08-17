import { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiHelper from "@/utils/apiHelper";
import {
  ArrowLeftIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import { toast } from "sonner";
type TransferVehicle = {
  id: number;
  chassisNo: string;
  serialNo?: string;
  vehicleSrNo?: string;
  modelName?: string;
  variantName?: string;
  colour?: string;
  itemName: string;
  itemCode: string;
  engineNo: string;
  mfgDate?: string;
  keyNumber?: string;
  batteryNo?: string;
  batteryMake?: string;
  first1TyreNo?: string;
  first2TyreNo?: string;
  second1TyreNo?: string;
  second2TyreNo?: string;
  location?: string;
  grnNo?: string;
  grnDate?: string;
  grnRecordDate?: string;
  purchasePriceNoGST?: number;
  purchasePriceTaxable?: number;
  status?: string; // "VERIFIED" | "TRANSFER"
};

type TransferDetails = {
  id: number;
  transferNo: string;
  transferDate: string;
  branch?: { branchName?: string };
  manager?: { accountName?: string };
  vehicles: TransferVehicle[];
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const DetailCard = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`dark:bg-dark-700/50 dark:border-dark-600 rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
  >
    <h4 className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
      {title}
    </h4>
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
  </div>
);

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => (
  <div>
    <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">{label}</p>
    <p className="dark:text-dark-200 text-sm font-medium text-gray-800 dark:text-white">
      {value || "-"}
    </p>
  </div>
);

const VehicleStockTransferDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transfer, setTransfer] = useState<TransferDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  // Right-side details drawer, per vehicle
  const [selectedVehicle, setSelectedVehicle] =
    useState<TransferVehicle | null>(null);
  const [showDetails, setShowDetails] = useState(false);

const getTransferDetails = async () => {
  try {
    setLoading(true);

    const res = await apiHelper.get(`/branch-panel/stocktransfer/${id}`);
    const data = res?.data || res;

    if (!data) {
      toast.error("Transfer details not found");
      setTransfer(null);
      return;
    }

    setTransfer(data);
  } catch (error: any) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "Failed to fetch transfer details"
    );

    setTransfer(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (id) getTransferDetails();
  }, [id]);

  const handleBack = () => {
    navigate("/stocktransfer/vehiclestock");
  };

  const vehicles = transfer?.vehicles || [];

const handleVerify = async (vehicleId: number) => {
  const vehicle = transfer?.vehicles.find((v) => v.id === vehicleId);
  if (!vehicle || vehicle.status === "VERIFIED") return; // already verified, no-op

  setVerifyingId(vehicleId);

  // optimistic update
  setTransfer((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      vehicles: prev.vehicles.map((v) =>
        v.id === vehicleId ? { ...v, status: "VERIFIED" } : v,
      ),
    };
  });

  try {
    const res = await apiHelper.patch(
      `/branch-panel/stocktransfer/verify/${vehicleId}`,
      { checked: true },
    );
    const updatedVehicle = res?.data || res;

    setTransfer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vehicles: prev.vehicles.map((v) =>
          v.id === vehicleId ? { ...v, ...updatedVehicle } : v,
        ),
      };
    });

    toast.success("Vehicle verified successfully");
  } catch (error: any) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to verify vehicle"
    );

    // revert on failure
    setTransfer((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vehicles: prev.vehicles.map((v) =>
          v.id === vehicleId ? { ...v, status: "TRANSFER" } : v,
        ),
      };
    });
  } finally {
    setVerifyingId(null);
  }
};

  const handleViewDetails = (vehicle: TransferVehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setTimeout(() => setSelectedVehicle(null), 200);
  };

  return (
    <div className="min-h-screen bg-white p-6 transition-colors duration-200 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold whitespace-nowrap text-gray-800 md:text-2xl dark:text-white">
            Transfer Details {transfer ? `- ${transfer.transferNo}` : ""}
          </h2>
          {transfer && (
            <p className="dark:text-dark-300 mt-1 text-sm text-gray-500">
              {formatDate(transfer.transferDate)} ·{" "}
              {transfer.branch?.branchName || "-"} ·{" "}
              {transfer.manager?.accountName || "-"}
            </p>
          )}
        </div>
        <button
          onClick={handleBack}
          className="bg-primary-500 hover:bg-primary-600 inline-flex w-auto cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <ArrowLeftIcon className="mr-1.5 size-4" />
          Back
        </button>
      </div>

      {loading && (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">
          Loading...
        </div>
      )}

      {!loading && transfer && (
        <div className="dark:bg-dark-800 dark:border-dark-700 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table
              hoverable
              className="w-full min-w-450 text-left [&_.table-th]:font-semibold"
            >
              <THead className="dark:bg-dark-700/60 dark:border-dark-600 border-b border-gray-200 bg-gray-100">
                <Tr>
                  <Th className="w-16 py-3.5 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    S.No
                  </Th>
                  <Th className="w-16 py-3.5 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    Action
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Chassis No
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Model
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Variant
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Colour
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Item Name
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Item Code
                  </Th>
                  <Th className="py-3.5 text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    Engine No
                  </Th>
                  <Th className="py-3.5 text-center text-xs font-semibold tracking-wider whitespace-nowrap text-gray-500 uppercase dark:text-gray-400">
                    View
                  </Th>
                </Tr>
              </THead>
              <TBody className="dark:divide-dark-700 divide-y divide-gray-200">
                {vehicles.map((item, index) => {
                  const isVerified = item.status === "VERIFIED";
                  const isBusy = verifyingId === item.id;
                  return (
                    <Tr
                      key={item.id}
                      className={`${
                        isVerified ? "dark:bg-dark-600/30 bg-gray-50/50" : ""
                      } dark:hover:bg-dark-700/40 transition-colors hover:bg-gray-50/30`}
                    >
                      <Td className="py-4 font-medium text-gray-500">
                        {index + 1}
                      </Td>
                      <Td className="py-4 text-center">
                        <button
                          type="button"
                          disabled={isVerified || isBusy}
                          onClick={() => handleVerify(item.id)}
                          title={isVerified ? "Verified" : "Click to verify"}
                          className={`inline-flex size-6 items-center justify-center rounded-lg border-2 transition-all duration-150 ${
                            isVerified
                              ? "cursor-not-allowed border-green-500 bg-green-500 text-white"
                              : "cursor-pointer border-gray-300 bg-white hover:border-primary-500 hover:bg-primary-50 dark:border-dark-500 dark:bg-transparent dark:hover:border-primary-500"
                          } ${isBusy ? "opacity-50" : ""}`}
                        >
                          {isVerified ? (
                            <CheckIcon className="size-4" strokeWidth={3} />
                          ) : null}
                        </button>
                      </Td>
                      <Td className="py-4 font-mono text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-400">
                        {item.chassisNo}
                      </Td>
                      <Td className="dark:text-dark-200 py-4 whitespace-nowrap text-gray-600">
                        {item.modelName}
                      </Td>
                      <Td className="dark:text-dark-200 py-4 whitespace-nowrap text-gray-600">
                        {item.variantName}
                      </Td>
                      <Td className="dark:text-dark-200 py-4 whitespace-nowrap text-gray-600">
                        <span
                          className="inline-flex h-3 w-3 rounded-full border border-gray-300"
                          style={{
                            backgroundColor: (item.colour || "").toLowerCase(),
                          }}
                        ></span>
                        <span className="ml-1">{item.colour}</span>
                      </Td>
                      <Td className="dark:text-dark-200 py-4 whitespace-nowrap text-gray-600">
                        {item.itemName}
                      </Td>
                      <Td className="dark:text-dark-200 py-4 whitespace-nowrap text-gray-600">
                        {item.itemCode}
                      </Td>
                      <Td className="dark:text-dark-200 py-4 whitespace-nowrap text-gray-600">
                        {item.engineNo}
                      </Td>
                      <Td className="py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(item)}
                          className="text-primary-600 hover:bg-primary-50 dark:hover:bg-dark-600 cursor-pointer rounded-md border p-2 transition"
                          title="View details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </Td>
                    </Tr>
                  );
                })}

                {vehicles.length === 0 && (
                  <Tr>
                    <Td
                      colSpan={9}
                      className="py-12 text-center text-gray-400 dark:text-gray-500"
                    >
                      No vehicles found in this transfer
                    </Td>
                  </Tr>
                )}
              </TBody>
            </Table>
          </div>
        </div>
      )}

      {!loading && !transfer && (
        <div className="py-12 text-center text-gray-400 dark:text-gray-500">
          Transfer not found
        </div>
      )}

      {/* Right-side Vehicle Details Drawer */}
      <Transition show={showDetails} as={Fragment}>
        <Dialog onClose={closeDetails} className="relative z-[300]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-3xl">
                    <div className="dark:bg-dark-800 flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                      <div className="dark:border-dark-700 flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                          Vehicle Details
                          {selectedVehicle?.chassisNo
                            ? ` - ${selectedVehicle.chassisNo}`
                            : ""}
                        </Dialog.Title>
                        <button
                          onClick={closeDetails}
                          className="dark:hover:bg-dark-600 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <XMarkIcon className="size-5" />
                        </button>
                      </div>

                      {selectedVehicle && (
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                          <div className="mb-5">
                            <input
                              type="text"
                              placeholder="Search vehicle..."
                              className="focus:border-primary-500 dark:border-dark-500 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm outline-none"
                            />
                          </div>

                          <div className="dark:from-dark-700 dark:to-dark-700 mb-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 dark:border dark:border-dark-600">
                            <div>
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                Chassis No
                              </p>
                              <p className="font-mono text-base font-semibold text-gray-900 dark:text-white">
                                {selectedVehicle.chassisNo || "-"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                Status
                              </p>
                              <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                {selectedVehicle.status || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <DetailCard title="Vehicle Info">
                              <DetailItem
                                label="Vehicle Sr. No"
                                value={
                                  selectedVehicle.vehicleSrNo ||
                                  selectedVehicle.serialNo
                                }
                              />
                              <DetailItem
                                label="Model"
                                value={selectedVehicle.modelName}
                              />
                              <DetailItem
                                label="Variant"
                                value={selectedVehicle.variantName}
                              />
                              <DetailItem
                                label="Colour"
                                value={
                                  <span className="flex items-center gap-2">
                                    <span
                                      className="h-3 w-3 rounded-full border border-gray-300"
                                      style={{
                                        backgroundColor:
                                          selectedVehicle.colour?.toLowerCase() ||
                                          "",
                                      }}
                                    />
                                    {selectedVehicle.colour || "-"}
                                  </span>
                                }
                              />
                            </DetailCard>

                            <DetailCard title="Item Info">
                              <DetailItem
                                label="Item Name"
                                value={selectedVehicle.itemName}
                              />
                              <DetailItem
                                label="Item Code"
                                value={selectedVehicle.itemCode}
                              />
                              <DetailItem
                                label="Engine No"
                                value={selectedVehicle.engineNo}
                              />
                              <DetailItem
                                label="MFG Date"
                                value={formatDate(selectedVehicle.mfgDate)}
                              />
                            </DetailCard>

                            <DetailCard title="Battery & Key">
                              <DetailItem
                                label="Key No"
                                value={selectedVehicle.keyNumber}
                              />
                              <DetailItem
                                label="Battery No"
                                value={selectedVehicle.batteryNo}
                              />
                              <DetailItem
                                label="Battery Make"
                                value={selectedVehicle.batteryMake}
                              />
                            </DetailCard>

                            <DetailCard title="Tyres">
                              <DetailItem
                                label="F1 Tyre No"
                                value={selectedVehicle.first1TyreNo}
                              />
                              <DetailItem
                                label="F2 Tyre No"
                                value={selectedVehicle.first2TyreNo}
                              />
                              <DetailItem
                                label="S1 Tyre No"
                                value={selectedVehicle.second1TyreNo}
                              />
                              <DetailItem
                                label="S2 Tyre No"
                                value={selectedVehicle.second2TyreNo}
                              />
                            </DetailCard>

                            <DetailCard
                              title="Location & GRN"
                              className="sm:col-span-2"
                            >
                              <DetailItem
                                label="Location"
                                value={selectedVehicle.location}
                              />
                              <DetailItem
                                label="GRN No"
                                value={selectedVehicle.grnNo}
                              />
                              <DetailItem
                                label="GRN Date"
                                value={formatDate(selectedVehicle.grnDate)}
                              />
                            </DetailCard>
                          </div>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default VehicleStockTransferDetails;