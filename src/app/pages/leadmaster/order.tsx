import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  ArrowsRightLeftIcon,
  CreditCardIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui";
import { DatePicker } from "@/components/shared/form/Datepicker";
import { Combobox } from "@/components/shared/form/Combobox";
import { Checkbox } from "@/components/ui/Form/Checkbox";
import { FiEdit2 } from "react-icons/fi";
/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface VehicleCharges {
  exShowroomPrice: string;
  insurance: string;
  roadSideAssistance: string;
  exWarranty2_3: string;
  hypothecationCharges: string;
  exWarranty2_8: string;
  rtoRegistrationCharges: string;
  rtoOtherCharge: string;
}

interface AllotmentDetails {
  model: string;
  variant: string;
  colour: string;
  chassisNo: string;
  policyNo: string;
  nomineeName: string;
  nomineeDob: string;
  relationWithNominee: string;
}

type HypothecationType = "finance" | "bank";
type PaymentStatus = "pending" | "received";

interface HypothecationDetails {
  type: HypothecationType;
  financeDoneBy: string;
  financeAmount: string;
  emi: string;
  tenureMonths: string;
  apronCharge: string;
  loanRoi: string;
  marginMoney: string;
  paymentStatus: PaymentStatus;
  assignBy: string;
  bankOfFinance: string;
}

interface ExchangeDetails {
  existingCustomerModel: string;
  existingCustomerVariant: string;
  existingVehicleYear: string;
  customerExpectedPrice: string;
  marketPrice: string;
  exchangeBonus: string;
  smiplShares: string;
  dealerShares: string;
  valueAddAccessories: string;
  insurance: string;
}

interface PaymentDetails {
  discount: string;
  schemeDiscount: string;
  exchangeDiscount: string;
  invoiceAmount: string;
  total: string;
  receivedAmount: string;
  pendingAmount: string;
}

interface BrokerDetails {
  brokerName: string;
  brokerAmount: string;
}

interface DeliveryChallan {
  invoiceBill: boolean;
  accessoriesInvoice: boolean;
  serviceBook: boolean;
  insuranceCopy: boolean;
  helmetInvoice: boolean;
  warrantyBook: boolean;
  keychainPouch: boolean;
  allGuard: boolean;
  matting: boolean;
  footrest: boolean;
  helmet: boolean;
  visor: boolean;
  seatCover: boolean;
  bodyCover: boolean;
  mirrorSet: boolean;
  other: boolean;
}

/* ------------------------------------------------------------------ */
/*  Reusable UI bits                                                   */
/* ------------------------------------------------------------------ */

const CardHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  colorClass: string;
}> = ({ icon, title, colorClass }) => (
  <div
    className={`flex items-center justify-between rounded-t-lg px-4 py-2.5 text-white ${colorClass}`}
  >
    <span className="flex items-center gap-2 text-sm font-semibold">
      <span className="size-5">{icon}</span>
      {title}
    </span>
    <button
      type="button"
      className="rounded p-1 text-white/90 transition-colors hover:bg-white/20"
      aria-label={`Edit ${title}`}
    >
      <FiEdit2 size={16} />
    </button>
  </div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dark:border-dark-600 dark:bg-dark-800 rounded-lg border border-gray-200 bg-white shadow-sm">
    {children}
  </div>
);

/* Wrapper that pins the input to the bottom of its grid cell so that
   labels of different lengths (1-line vs 2-line) don't cause the
   input boxes to misalign horizontally within the same row. */
const Field: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col justify-end">{children}</div>
);

/* Consistent responsive class for every 2-column field grid:
   - default (phone): 2 columns
   - lg (outer grid becomes 3 cards/row, each card narrow): 1 column
   - xl (cards wide enough again): 2 columns */
const fieldGrid = "grid grid-cols-2 gap-3 p-4 lg:grid-cols-1 xl:grid-cols-2";

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const Order: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      console.log("Lead ID:", id);
    }
  }, [id]);

  const [vehicleCharges, setVehicleCharges] = useState<VehicleCharges>({
    exShowroomPrice: "",
    insurance: "",
    roadSideAssistance: "",
    exWarranty2_3: "",
    hypothecationCharges: "",
    exWarranty2_8: "",
    rtoRegistrationCharges: "",
    rtoOtherCharge: "",
  });

  const [allotment, setAllotment] = useState<AllotmentDetails>({
    model: "",
    variant: "",
    colour: "",
    chassisNo: "",
    policyNo: "",
    nomineeName: "",
    nomineeDob: "",
    relationWithNominee: "",
  });

  const [hypothecation, setHypothecation] = useState<HypothecationDetails>({
    type: "finance",
    financeDoneBy: "",
    financeAmount: "0",
    emi: "0",
    tenureMonths: "0",
    apronCharge: "0",
    loanRoi: "0",
    marginMoney: "0",
    paymentStatus: "pending",
    assignBy: "",
    bankOfFinance: "",
  });

  const [exchange, setExchange] = useState<ExchangeDetails>({
    existingCustomerModel: "",
    existingCustomerVariant: "",
    existingVehicleYear: "",
    customerExpectedPrice: "0",
    marketPrice: "0",
    exchangeBonus: "0",
    smiplShares: "0",
    dealerShares: "0",
    valueAddAccessories: "0",
    insurance: "0",
  });

  const [payment, setPayment] = useState<PaymentDetails>({
    discount: "0",
    schemeDiscount: "0",
    exchangeDiscount: "0",
    invoiceAmount: "0",
    total: "0",
    receivedAmount: "0",
    pendingAmount: "0",
  });

  const [broker, setBroker] = useState<BrokerDetails>({
    brokerName: "",
    brokerAmount: "",
  });

  const [delivery, setDelivery] = useState<DeliveryChallan>({
    invoiceBill: false,
    accessoriesInvoice: false,
    serviceBook: false,
    insuranceCopy: false,
    helmetInvoice: false,
    warrantyBook: false,
    keychainPouch: false,
    allGuard: false,
    matting: false,
    footrest: false,
    helmet: false,
    visor: false,
    seatCover: false,
    bodyCover: false,
    mirrorSet: false,
    other: false,
  });

  const totalValue = 0;

  const bankOptions = [
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "sbi", name: "State Bank of India" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Mahindra Bank" },
  ];

  const brokerOptions = [
    { id: "broker1", name: "Broker A" },
    { id: "broker2", name: "Broker B" },
    { id: "broker3", name: "Broker C" },
  ];

  const employeeOptions = [
    { id: "emp1", name: "Employee 1" },
    { id: "emp2", name: "Employee 2" },
    { id: "emp3", name: "Employee 3" },
  ];

  const relationOptions = [
    { id: "father", name: "Father" },
    { id: "mother", name: "Mother" },
    { id: "spouse", name: "Spouse" },
    { id: "son", name: "Son" },
    { id: "daughter", name: "Daughter" },
    { id: "other", name: "Other" },
  ];

  const financeDoneByOptions = [
    { id: "self", name: "Self" },
    { id: "dealer", name: "Dealer" },
    { id: "dsa", name: "DSA" },
  ];

  return (
    <div className="dark:bg-dark-900 min-h-screen bg-gray-50 p-4">
      {/* Title row */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Create Order
        </h1>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center rounded bg-red-600 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-red-700"
            title="Download PDF"
          >
            <DocumentTextIcon className="size-4" />
          </button>
          <button
            className="flex items-center justify-center rounded bg-emerald-600 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-emerald-700"
            title="Download Excel"
          >
            <DocumentArrowDownIcon className="size-4" />
          </button>
          <button
            className="flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-white shadow-sm transition-colors hover:bg-blue-700"
            title="Refresh"
          >
            <ArrowPathIcon className="size-4" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 hover:bg-primary-800 flex cursor-pointer items-center gap-1.5 rounded px-3 py-1.5 text-white transition-colors"
            title="Back"
          >
            <ArrowLeftIcon className="size-4" />
            <span className="text-sm">Back</span>
          </button>
        </div>
      </div>

      {/* Grid of 7 cards, 3 columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 1. Vehicle Charges - Blue */}
        <Card>
          <CardHeader
            icon={<TruckIcon className="size-5" />}
            title="Vehicle Charges"
            colorClass="bg-blue-700"
          />
          <div className={fieldGrid}>
            <Field>
              <Input
                label="Ex-Showroom Price"
                placeholder="Enter Ex-Showroom Price"
                value={vehicleCharges.exShowroomPrice}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    exShowroomPrice: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Insurance"
                placeholder="Enter Insurance"
                value={vehicleCharges.insurance}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    insurance: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Road Side Assistance"
                placeholder="Enter Road Side Assistance"
                value={vehicleCharges.roadSideAssistance}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    roadSideAssistance: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Ex. Warranty (2+3)"
                placeholder="Enter Ex. Warranty"
                value={vehicleCharges.exWarranty2_3}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    exWarranty2_3: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Hypothecation Charges"
                placeholder="Enter Hypothecation Charges"
                value={vehicleCharges.hypothecationCharges}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    hypothecationCharges: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Ex-warranty (2+8)"
                placeholder="Enter Ex-warranty"
                value={vehicleCharges.exWarranty2_8}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    exWarranty2_8: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="RTO & Registration Charges"
                placeholder="Enter RTO Charges"
                value={vehicleCharges.rtoRegistrationCharges}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    rtoRegistrationCharges: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="RTO Other Charge"
                placeholder="Enter RTO Other Charge"
                value={vehicleCharges.rtoOtherCharge}
                onChange={(e) =>
                  setVehicleCharges((s) => ({
                    ...s,
                    rtoOtherCharge: e.target.value,
                  }))
                }
              />
            </Field>
          </div>
        </Card>

        {/* 2. Allotment Details - Teal */}
        <Card>
          <CardHeader
            icon={<ClipboardDocumentListIcon className="size-5" />}
            title="Allotment Details"
            colorClass="bg-teal-700"
          />
          <div className="space-y-3 p-4">
            <div className={fieldGrid.replace("p-4", "")}>
              <Field>
                <Input
                  label="Model"
                  placeholder="Enter Model"
                  value={allotment.model}
                  onChange={(e) =>
                    setAllotment((s) => ({ ...s, model: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <Input
                  label="Variant"
                  placeholder="Enter Variant"
                  value={allotment.variant}
                  onChange={(e) =>
                    setAllotment((s) => ({ ...s, variant: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <Input
                  label="Colour"
                  placeholder="Enter Colour"
                  value={allotment.colour}
                  onChange={(e) =>
                    setAllotment((s) => ({ ...s, colour: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <Input
                  label="Chassis No"
                  value={allotment.chassisNo}
                  placeholder="Select Vehicle"
                  onChange={(e) =>
                    setAllotment((s) => ({
                      ...s,
                      chassisNo: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>

            <p className="pt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Insurance Details
            </p>

            <div className={fieldGrid.replace("p-4", "")}>
              <Field>
                <Input
                  label="Policy No"
                  value={allotment.policyNo}
                  placeholder="Enter Policy No."
                  onChange={(e) =>
                    setAllotment((s) => ({ ...s, policyNo: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <Input
                  label="Nominee Name"
                  value={allotment.nomineeName}
                  placeholder="Enter Nominee Name"
                  onChange={(e) =>
                    setAllotment((s) => ({
                      ...s,
                      nomineeName: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field>
                <DatePicker
                  label="Nominee DOB"
                  placeholder="DD-MM-YYYY"
                  value={allotment.nomineeDob}
                  onChange={(val: any) =>
                    setAllotment((s) => ({ ...s, nomineeDob: val }))
                  }
                  options={{ dateFormat: "d-m-Y" }}
                />
              </Field>
              <Field>
                <Combobox
                  label="Relation With Nominee"
                  data={relationOptions}
                  displayField="name"
                  value={
                    relationOptions.find(
                      (r) => r.name === allotment.relationWithNominee,
                    ) || null
                  }
                  onChange={(val: any) =>
                    setAllotment((s) => ({
                      ...s,
                      relationWithNominee: val?.name || "",
                    }))
                  }
                  placeholder="Select Relation"
                />
              </Field>
            </div>
          </div>
        </Card>

        {/* 3. Hypothecation - Indigo */}
        <Card>
          <CardHeader
            icon={<BuildingLibraryIcon className="size-5" />}
            title="Hypothecation"
            colorClass="bg-indigo-700"
          />
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="hypothecationType"
                  checked={hypothecation.type === "finance"}
                  onChange={() =>
                    setHypothecation((s) => ({ ...s, type: "finance" }))
                  }
                  className="dark:bg-dark-800 h-4 w-4 text-[#003399] focus:ring-[#003399]"
                />
                Finance
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="hypothecationType"
                  checked={hypothecation.type === "bank"}
                  onChange={() =>
                    setHypothecation((s) => ({ ...s, type: "bank" }))
                  }
                  className="dark:bg-dark-800 h-4 w-4 text-[#003399] focus:ring-[#003399]"
                />
                Bank
              </label>
            </div>

            {hypothecation.type === "bank" ? (
              <Field>
                <Combobox
                  label="Bank Of Finance"
                  data={bankOptions}
                  displayField="name"
                  value={
                    bankOptions.find(
                      (b) => b.name === hypothecation.bankOfFinance,
                    ) || null
                  }
                  onChange={(val: any) =>
                    setHypothecation((s) => ({
                      ...s,
                      bankOfFinance: val?.name || "",
                    }))
                  }
                  placeholder="Select Bank"
                />
              </Field>
            ) : (
              <>
                <div className={fieldGrid.replace("p-4", "")}>
                  <Field>
                    <Combobox
                      label="Finance Done By"
                      data={financeDoneByOptions}
                      displayField="name"
                      value={
                        financeDoneByOptions.find(
                          (f) => f.name === hypothecation.financeDoneBy,
                        ) || null
                      }
                      onChange={(val: any) =>
                        setHypothecation((s) => ({
                          ...s,
                          financeDoneBy: val?.name || "",
                        }))
                      }
                      placeholder="Select"
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Finance Amount"
                      placeholder="Enter Finance Amount"
                      value={hypothecation.financeAmount}
                      onChange={(e) =>
                        setHypothecation((s) => ({
                          ...s,
                          financeAmount: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Input
                      label="EMI"
                      placeholder="Enter EMI"
                      value={hypothecation.emi}
                      onChange={(e) =>
                        setHypothecation((s) => ({
                          ...s,
                          emi: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Tenure (Months)"
                      placeholder="Enter Tenure (Months)"
                      value={hypothecation.tenureMonths}
                      onChange={(e) =>
                        setHypothecation((s) => ({
                          ...s,
                          tenureMonths: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Processing Charge"
                      placeholder="Enter Processing Charge"
                      value={hypothecation.apronCharge}
                      onChange={(e) =>
                        setHypothecation((s) => ({
                          ...s,
                          apronCharge: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Loan ROI"
                      placeholder="Enter Loan ROI"
                      value={hypothecation.loanRoi}
                      onChange={(e) =>
                        setHypothecation((s) => ({
                          ...s,
                          loanRoi: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <Input
                      label="Margin Money (Down Payment)"
                      placeholder="Enter Margin Money"
                      value={hypothecation.marginMoney}
                      onChange={(e) =>
                        setHypothecation((s) => ({
                          ...s,
                          marginMoney: e.target.value,
                        }))
                      }
                    />
                  </Field>
                  <Field>
                    <div className="flex min-w-0 flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Payment Status
                      </label>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                        <label className="flex cursor-pointer items-center gap-1 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                          <input
                            type="radio"
                            name="paymentStatus"
                            checked={hypothecation.paymentStatus === "pending"}
                            onChange={() =>
                              setHypothecation((s) => ({
                                ...s,
                                paymentStatus: "pending",
                              }))
                            }
                            className="dark:bg-dark-800 h-4 w-4 text-[#003399] focus:ring-[#003399]"
                          />
                          Pending
                        </label>
                        <label className="flex cursor-pointer items-center gap-1 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                          <input
                            type="radio"
                            name="paymentStatus"
                            checked={hypothecation.paymentStatus === "received"}
                            onChange={() =>
                              setHypothecation((s) => ({
                                ...s,
                                paymentStatus: "received",
                              }))
                            }
                            className="dark:bg-dark-800 h-4 w-4 text-[#003399] focus:ring-[#003399]"
                          />
                          Received
                        </label>
                      </div>
                    </div>
                  </Field>
                  =
                </div>

                <Field>
                  <Combobox
                    label="Assign By"
                    data={employeeOptions}
                    displayField="name"
                    value={
                      employeeOptions.find(
                        (e) => e.name === hypothecation.assignBy,
                      ) || null
                    }
                    onChange={(val: any) =>
                      setHypothecation((s) => ({
                        ...s,
                        assignBy: val?.name || "",
                      }))
                    }
                    placeholder="Select Employee"
                  />
                </Field>
              </>
            )}
          </div>
        </Card>

        {/* 4. Exchange Details - Amber */}
        <Card>
          <CardHeader
            icon={<ArrowsRightLeftIcon className="size-5" />}
            title="Exchange Details"
            colorClass="bg-amber-600"
          />
          <div className={fieldGrid}>
            <Field>
              <Input
                label="Existing Customer Model"
                value={exchange.existingCustomerModel}
                placeholder="Enter Customer Model"
                onChange={(e) =>
                  setExchange((s) => ({
                    ...s,
                    existingCustomerModel: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Existing Customer Variant"
                value={exchange.existingCustomerVariant}
                placeholder="Enter Customer Variant"
                onChange={(e) =>
                  setExchange((s) => ({
                    ...s,
                    existingCustomerVariant: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Existing Vehicle Year"
                value={exchange.existingVehicleYear}
                placeholder="Enter Vehicle Year"
                onChange={(e) =>
                  setExchange((s) => ({
                    ...s,
                    existingVehicleYear: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Customer Expected Price"
                value={exchange.customerExpectedPrice}
                placeholder="Enter Expected Price"
                onChange={(e) =>
                  setExchange((s) => ({
                    ...s,
                    customerExpectedPrice: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Market Price"
                value={exchange.marketPrice}
                placeholder="Enter Market Price"
                onChange={(e) =>
                  setExchange((s) => ({ ...s, marketPrice: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Exchange Bonus"
                value={exchange.exchangeBonus}
                placeholder="Enter Exchange Bonus"
                onChange={(e) =>
                  setExchange((s) => ({
                    ...s,
                    exchangeBonus: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="SMIPL Shares"
                value={exchange.smiplShares}
                placeholder="Enter SMIPL Shares"
                onChange={(e) =>
                  setExchange((s) => ({ ...s, smiplShares: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Dealer Shares"
                value={exchange.dealerShares}
                placeholder="Enter Dealer Shares"
                onChange={(e) =>
                  setExchange((s) => ({ ...s, dealerShares: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Value Add Accessories"
                value={exchange.valueAddAccessories}
                placeholder="Enter Accessories Value"
                onChange={(e) =>
                  setExchange((s) => ({
                    ...s,
                    valueAddAccessories: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Insurance"
                placeholder="Enter Insurance"
                value={exchange.insurance}
                onChange={(e) =>
                  setExchange((s) => ({ ...s, insurance: e.target.value }))
                }
              />
            </Field>
            <div className="col-span-2 mt-1 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
              Total Value: {totalValue}
            </div>
          </div>
        </Card>

        {/* 5. Payment Details - Rose */}
        <Card>
          <CardHeader
            icon={<CreditCardIcon className="size-5" />}
            title="Payment Details"
            colorClass="bg-rose-700"
          />
          <div className={fieldGrid}>
            <Field>
              <Input
                label="Discount"
                value={payment.discount}
                placeholder="Enter Discount"
                onChange={(e) =>
                  setPayment((s) => ({ ...s, discount: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Scheme Discount"
                value={payment.schemeDiscount}
                placeholder="Enter Scheme Discount"
                onChange={(e) =>
                  setPayment((s) => ({
                    ...s,
                    schemeDiscount: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Exchange Discount"
                value={payment.exchangeDiscount}
                placeholder="Enter Exchange Discount"
                onChange={(e) =>
                  setPayment((s) => ({
                    ...s,
                    exchangeDiscount: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Invoice Amount"
                value={payment.invoiceAmount}
                placeholder="Enter Invoice Amount"
                onChange={(e) =>
                  setPayment((s) => ({
                    ...s,
                    invoiceAmount: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Total"
                value={payment.total}
                onChange={(e) =>
                  setPayment((s) => ({ ...s, total: e.target.value }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Received Amount"
                value={payment.receivedAmount}
                onChange={(e) =>
                  setPayment((s) => ({
                    ...s,
                    receivedAmount: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <Input
                label="Pending Amount"
                value={payment.pendingAmount}
                onChange={(e) =>
                  setPayment((s) => ({
                    ...s,
                    pendingAmount: e.target.value,
                  }))
                }
              />
            </Field>
          </div>
        </Card>

        {/* 6. Broker Details + 7. Delivery Challan (in same column) */}
        <div className="flex flex-col gap-4">
          {/* 6. Broker Details - Fuchsia */}
          <Card>
            <CardHeader
              icon={<UserGroupIcon className="size-5" />}
              title="Broker Details"
              colorClass="bg-fuchsia-700"
            />
            <div className={fieldGrid}>
              <Field>
                <Combobox
                  label="Broker Name"
                  data={brokerOptions}
                  displayField="name"
                  value={
                    brokerOptions.find((b) => b.name === broker.brokerName) ||
                    null
                  }
                  onChange={(val: any) =>
                    setBroker((s) => ({ ...s, brokerName: val?.name || "" }))
                  }
                  placeholder="Select Broker"
                />
              </Field>
              <Field>
                <Input
                  label="Broker Amount"
                  value={broker.brokerAmount}
                  placeholder="Enter Broker Amount"
                  onChange={(e) =>
                    setBroker((s) => ({
                      ...s,
                      brokerAmount: e.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </Card>

          {/* 7. Delivery Challan - Slate */}
          <Card>
            <CardHeader
              icon={<DocumentTextIcon className="size-5" />}
              title="Delivery Challan"
              colorClass="bg-slate-700"
            />
            <div className="p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Checkbox
                  label="Invoice Bill"
                  checked={delivery.invoiceBill}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      invoiceBill: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Accessories Invoice"
                  checked={delivery.accessoriesInvoice}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      accessoriesInvoice: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Service Book"
                  checked={delivery.serviceBook}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      serviceBook: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Insurance Copy"
                  checked={delivery.insuranceCopy}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      insuranceCopy: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Helmet Invoice"
                  checked={delivery.helmetInvoice}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      helmetInvoice: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Warranty Book"
                  checked={delivery.warrantyBook}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      warrantyBook: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Keychain Pouch"
                  checked={delivery.keychainPouch}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      keychainPouch: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="All Guard"
                  checked={delivery.allGuard}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      allGuard: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Matting"
                  checked={delivery.matting}
                  onChange={(e) =>
                    setDelivery((s) => ({ ...s, matting: e.target.checked }))
                  }
                />
                <Checkbox
                  label="Footrest"
                  checked={delivery.footrest}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      footrest: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Helmet"
                  checked={delivery.helmet}
                  onChange={(e) =>
                    setDelivery((s) => ({ ...s, helmet: e.target.checked }))
                  }
                />
                <Checkbox
                  label="Visor"
                  checked={delivery.visor}
                  onChange={(e) =>
                    setDelivery((s) => ({ ...s, visor: e.target.checked }))
                  }
                />
                <Checkbox
                  label="Seat Cover"
                  checked={delivery.seatCover}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      seatCover: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Body Cover"
                  checked={delivery.bodyCover}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      bodyCover: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Mirror Set"
                  checked={delivery.mirrorSet}
                  onChange={(e) =>
                    setDelivery((s) => ({
                      ...s,
                      mirrorSet: e.target.checked,
                    }))
                  }
                />
                <Checkbox
                  label="Other"
                  checked={delivery.other}
                  onChange={(e) =>
                    setDelivery((s) => ({ ...s, other: e.target.checked }))
                  }
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submit Button - Bottom Center */}
      <div className="mt-8 flex justify-center">
        <button className="rounded-lg bg-[#003399] px-8 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-[#002277] hover:shadow-lg">
          Create Order
        </button>
      </div>
    </div>
  );
};

export default Order;
