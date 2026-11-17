import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "@/utils/axios";
import logo from "@/assets/logo.png";

interface Company {
  id: number;
  companyName: string;
  financialYears: {
    id: number;
    financialYear: string;
    fyStartDate: string;
    fyEndDate: string;
  }[];
}

export default function Selectcomapny() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("/company");
      setCompanies(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectCompany = (company: Company) => {
    const financialYear = company.financialYears?.[0];

    if (!financialYear) {
      alert("Financial year not found");
      return;
    }

    localStorage.setItem("companyId", String(company.id));
    localStorage.setItem("companyName", company.companyName);

    localStorage.setItem("financialYearId", String(financialYear.id));
    localStorage.setItem("financialYear", financialYear.financialYear);
    localStorage.setItem("fyStartDate", financialYear.fyStartDate);
    localStorage.setItem("fyEndDate", financialYear.fyEndDate);

    navigate("/dashboards/dashboard");
  };

  return (
    <div className="dark:bg-dark-900 flex h-screen bg-gray-100">
      {/* Left Side */}
      <div className="dark:bg-dark-700 flex w-full flex-col bg-white p-8 xl:w-1/2">
        {/* Logo */}
        <div className="mb-6 flex justify-center pt-10">
          <img
            src={logo}
            alt="KrushiMall"
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mb-5 flex items-center gap-3">
          <div className="bg-primary-500 h-7 w-2 rounded"></div>

          <h2 className="dark:text-dark-50 text-2xl font-bold text-gray-800">
            Select Company
          </h2>
        </div>

        {/* Company Table */}
        <div className="h-100 overflow-auto rounded-lg border">
          <table className="w-full">
            <thead className="dark:bg-dark-600 sticky top-0 bg-gray-100">
              <tr>
                <th className="p-3 text-left">Company Name</th>
                <th className="p-3 text-left">Fy Start Date</th>
                <th className="p-3 text-left">Fy End Date</th>
              </tr>
            </thead>

            <tbody>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => handleSelectCompany(company)}
                    className="cursor-pointer border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{company.companyName}</td>

                    <td className="p-3">
                      {company.financialYears?.[0]?.fyStartDate
                        ? new Date(
                            company.financialYears[0].fyStartDate,
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-3">
                      {company.financialYears?.[0]?.fyEndDate
                        ? new Date(
                            company.financialYears[0].fyEndDate,
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-gray-500">
                    No company assigned. Please contact your admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden h-full xl:block xl:w-1/2">
        <img
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a"
          alt="company"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}