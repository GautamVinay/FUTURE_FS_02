import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useNotes(leadId: number) {
  return useQuery({
    queryKey: [api.notes.list.path, leadId],
    queryFn: async () => {
      const url = buildUrl(api.notes.list.path, { leadId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      return api.notes.list.responses[200].parse(await res.json());
    },
    enabled: !!leadId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, content }: { leadId: number; content: string }) => {
      const url = buildUrl(api.notes.create.path, { leadId });
      const res = await fetch(url, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create note");
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path, variables.leadId] });
      // Also invalidate activities since creating a note adds an activity
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path, variables.leadId] });
    },
  });
}
