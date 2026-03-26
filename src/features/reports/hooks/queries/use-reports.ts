import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { ReportsService } from "../../services/reports-service";

export interface UseReportsProps {
  from?: string;
  to?: string;
}

export function useReports({ from, to }: UseReportsProps = {}) {
  const supabase = createClient();
  const reportsService = new ReportsService(supabase);

  return useQuery({
    queryKey: ["reports", { from, to }],
    queryFn: async () => {
      const [monthlyRevenue, categorySales, productRanking, orderCount, dailyRevenue] = await Promise.all([
        reportsService.getMonthlyRevenueReport(from, to),
        reportsService.getCategorySalesReport(from, to),
        reportsService.getProductRankingReport(from, to),
        reportsService.getOrderCountReport(from, to),
        reportsService.getDailyRevenueReport(from, to),
      ]);

      return {
        monthlyRevenue,
        categorySales,
        productRanking,
        orderCount,
        dailyRevenue,
      };
    },
  });
}
