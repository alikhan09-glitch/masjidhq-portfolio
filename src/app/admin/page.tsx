"use client";

import { useEffect, useState } from "react";
import RangeSelector from "../../components/Dashboard/RangeSelector";
import FinancialOverview from "../../components/Dashboard/FinancialOverview";
import QuickActions from "../../components/Dashboard/QuickActions";
import IncomeExpenseChart from "../../components/Dashboard/IncomeExpenseChart";
import FinancialChart from "../../components/Dashboard/FinancialChart";
import ExpenseCategoryBreakdown from "../../components/Dashboard/ExpenseCategoryBreakdown";
import MemberOverview from "../../components/Dashboard/MemberOverview";
import MosqueOverview from "../../components/Dashboard/MosqueOverview";
import HealthScoreCard from "../../components/Dashboard/HealthScoreCard";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [range, setRange] = useState("monthly");

  useEffect(() => {
    fetch(`/api/admin/dashboard?range=${range}`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
      });
  }, [range]);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        <RangeSelector range={range} setRange={setRange} />

        <FinancialOverview data={data.financial} />

        <QuickActions/>

        <IncomeExpenseChart chartData={data.financial.chart} />

        <FinancialChart chartData={data.financial.chart} />

        <ExpenseCategoryBreakdown categories={data.financial.categoryBreakdown} />

        <MemberOverview data={data.members} />

        <MosqueOverview data={data.mosque} />

        <HealthScoreCard score={data.system.healthScore} />

      </div>
    </div>
  );
}