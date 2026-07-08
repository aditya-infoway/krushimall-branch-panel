import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  ChevronUpIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui";
import { RiFilePdfFill, RiFileExcel2Fill } from "react-icons/ri";

interface FollowupEntry {
  id: number;
  companyName: string;
  companyRole: string;
  followupDate: string;
  followupTime: string;
  exPuDate: string;
  callResponse: string;
  callDiscussion: string;
  enquiryStatus: string;
  employeeName: string;
  employeeRole: string;
  createdDateTime: string;
}

type TabType = "followup" | "feedback";

const FollowupHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("followup");
  const [collapsed, setCollapsed] = useState(false);

  const followupData: FollowupEntry[] = [
    {
      id: 1,
      companyName: "Rajlaxmi Motors",
      companyRole: "Super Admin",
      followupDate: "20-06-2026",
      followupTime: "03:41 PM",
      exPuDate: "17-06-2026",
      callResponse: "Connected",
      callDiscussion: "Customer interested in Mahindra 265 DI",
      enquiryStatus: "Exchange in Lineup",
      employeeName: "Rajlaxmi Motors",
      employeeRole: "Super Admin",
      createdDateTime: "18-06-2026, 03:41 PM",
    },
     {
      id: 1,
      companyName: "Rajlaxmi Motors",
      companyRole: "Super Admin",
      followupDate: "20-06-2026",
      followupTime: "03:41 PM",
      exPuDate: "17-06-2026",
      callResponse: "Connected",
      callDiscussion: "Customer interested in Mahindra 265 DI",
      enquiryStatus: "Exchange in Lineup",
      employeeName: "Rajlaxmi Motors",
      employeeRole: "Super Admin",
      createdDateTime: "18-06-2026, 03:41 PM",
    },
    
  ];

  const feedbackData: FollowupEntry[] = [
    {
      id: 1,
      companyName: "Rajlaxmi Motors",
      companyRole: "Super Admin",
      followupDate: "22-06-2026",
      followupTime: "10:30 AM",
      exPuDate: "20-06-2026",
      callResponse: "Feedback Given",
      callDiscussion: "Customer gave positive feedback about the tractor",
      enquiryStatus: "Feedback Completed",
      employeeName: "Rajlaxmi Motors",
      employeeRole: "Super Admin",
      createdDateTime: "18-06-2026, 10:30 AM",
    },
  ];

  const activeData = activeTab === "followup" ? followupData : feedbackData;

  return (
    <div className="dark:bg-dark-800 min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-5 xl:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 md:flex-row md:items-center md:gap-0">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
          {activeTab === "followup" ? "Follow-up History" : "Feedback History"}
        </h2>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 sm:h-9 sm:w-9 lg:h-9.5 lg:w-9.5 dark:text-gray-300">
            <RiFilePdfFill className="text-base text-red-500 sm:text-lg" />
          </button>
          <button className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50 sm:h-9 sm:w-9 lg:h-9.5 lg:w-9.5 dark:text-gray-300">
            <RiFileExcel2Fill className="text-base text-green-500 sm:text-lg" />
          </button>
          <button className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 sm:h-9 sm:w-9 lg:h-9.5 lg:w-9.5 dark:text-gray-300">
            <ArrowPathIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="dark:border-dark-600 dark:bg-dark-700 dark:hover:bg-dark-600 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 sm:h-9 sm:w-9 lg:h-9.5 lg:w-9.5 dark:text-gray-300"
          >
            <ChevronUpIcon
              className={`h-3.5 w-3.5 transition-transform sm:h-4 sm:w-4 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary-600 hover:bg-primary-700 flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-medium text-white shadow-sm transition-colors sm:h-9 sm:px-3 sm:text-sm lg:h-9.5"
          >
            <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-2 sm:p-4 lg:p-6">
          {/* Tabs */}
          <div className="mb-6 flex justify-center overflow-x-auto sm:mb-8">
            <div className="dark:bg-dark-800 flex min-w-fit items-center gap-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab("followup")}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                  activeTab === "followup"
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Follow-up History
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-sm ${
                  activeTab === "feedback"
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Feedback History
              </button>
            </div>
          </div>

          {/* Timeline */}
        {/* Timeline */}
{activeData.length === 0 ? (
  <div className="flex h-40 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
    No {activeTab === "followup" ? "follow-up" : "feedback"} history
    available
  </div>
) : (
  <div className="relative">
    {activeData.map((entry) => (
      <div key={entry.id} className="relative flex gap-4 pb-6 sm:gap-6 sm:pb-8 last:pb-0">
        {/* Timeline marker */}
        <div className="relative flex w-3 shrink-0 flex-col items-center">
          <span className="bg-primary-500 ring-primary-100 dark:ring-primary-900/30 relative z-10 mt-2 h-3 w-3 shrink-0 rounded-full ring-4" />
          {/* Line always renders, absolutely positioned to stretch the full row height */}
          <span className="dark:bg-dark-600 absolute top-2 left-1/2 h-full w-px -translate-x-1/2 bg-gray-300" />
        </div>

        {/* Info Card */}
        <div className="dark:bg-dark-800 dark:border-dark-600 flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <UserIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {entry.companyName}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({entry.companyRole})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <CalendarDaysIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Follow-up Date:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {entry.followupDate}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <ClockIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Follow-up Time:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {entry.followupTime}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <CalendarDaysIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Ex. Pu. Date:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {entry.exPuDate}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <PhoneIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Call Response:
                </span>
                <Badge
                  variant="filled"
                  color="primary"
                  className="rounded-full text-xs"
                >
                  {entry.callResponse}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <ChatBubbleLeftRightIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Call Discussion:
                </span>
                <span className="break-words text-gray-600 dark:text-gray-400">
                  {entry.callDiscussion || "—"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
                <CheckCircleIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Enquiry Status:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {entry.enquiryStatus}
                </span>
              </div>
            </div>

            {/* Right column */}
           {/* Right column */}
<div className="space-y-2.5 sm:space-y-3">
  <div className="flex flex-wrap items-center justify-end gap-1.5 text-xs sm:gap-2 sm:text-sm">
    <UserIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
    <span className="font-semibold text-gray-700 dark:text-gray-300">
      Employee Name:
    </span>
    <span className="break-words text-right text-gray-600 dark:text-gray-400">
      {entry.employeeName} ({entry.employeeRole})
    </span>
  </div>
  <div className="flex flex-wrap items-center justify-end gap-1.5 text-xs sm:gap-2 sm:text-sm mr-7">
    <CalendarDaysIcon className="text-primary-500 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
    <span className="font-semibold text-gray-700 dark:text-gray-300">
      Created Date & Time:
    </span>
    <span className="break-words text-right text-gray-600 dark:text-gray-400">
      {entry.createdDateTime}
    </span>
  </div>
</div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
        </div>
      )}
    </div>
  );
};

export default FollowupHistory;
