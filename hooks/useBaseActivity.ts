"use client";

import { useState, useEffect, useCallback } from "react";
import type { WalletActivity } from "@/lib/baseActivity";

interface UseBaseActivityResult {
  data: WalletActivity | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBaseActivity(address: string | null): UseBaseActivityResult {
  const [data, setData] = useState<WalletActivity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const url = "/api/base/" + address;
      const res = await fetch(url);
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to fetch activity");
      }
      const json: WalletActivity = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { data, loading, error, refetch: fetchActivity };
}