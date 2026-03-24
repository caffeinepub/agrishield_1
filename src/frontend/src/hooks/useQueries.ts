import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScanRecord, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useGetScanHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<ScanRecord[]>({
    queryKey: ["scanHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getScanHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddScanRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: ScanRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.addScanRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanHistory"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
