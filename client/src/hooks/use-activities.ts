import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useActivities(leadId: number) {
  return useQuery({
    queryKey: [api.activities.list.path, leadId],
    queryFn: async () => {
      const url = buildUrl(api.activities.list.path, { leadId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activities");
      return api.activities.list.responses[200].parse(await res.json());
    },
    enabled: !!leadId,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [api.dashboard.stats.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return api.dashboard.stats.responses[200].parse(await res.json());
    },
  });
}
