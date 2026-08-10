import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Key = string | readonly unknown[];

export function useRealtime(table: string, queryKeys: Key[]) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`rt-${table}-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        "postgres_changes" as never,
        { event: "*", schema: "public", table },
        () => {
          queryKeys.forEach((k) =>
            qc.invalidateQueries({ queryKey: Array.isArray(k) ? k : [k] }),
          );
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);
}