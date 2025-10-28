"use client";
import { Anchor, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { IconUsers } from "@tabler/icons-react";

type CheckInResponse = {
    success: boolean,
    warning?: string,
    error?: string
}

export default function ScannerPage() {
    const [result, setResult] = useState<CheckInResponse | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleScan = async (detectedCodes: any) => {
      if (!detectedCodes || loading) return;

      const data = detectedCodes[0]?.rawValue;
      console.log("scan data: " + data);

      const url = new URL(data);
      const id = url.searchParams.get("id");

      setLoading(true);
      try {
          const res = await fetch("/api/check-in", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
          });
          const json = await res.json();
          setResult(json);
      } 
      catch (e) { setResult({ success: false, error: "server error" }) } 
      finally { setLoading(false) }
    };

    const handleError = (error: any) => {
        console.error(error);
        setResult({ success: false, error: "camera error" });
    };


    return (
      <Stack align="center"  style={{ height: "100vh", padding: 20 }}>
        <Group>
          <Title w={700}> Ticket Scanner </Title>
          <Anchor><IconUsers /></Anchor>
        </Group>

      <Paper shadow="sm" p="md" style={{ width: 320 }}>
        <Scanner onScan={handleScan} onError={handleError} />
      </Paper>

      {result && (
        <Paper
          shadow="sm"
          p="md"
          mt="md"
          style={{
            backgroundColor: result.success ? "#D1FAE5" : "#FEE2E2",
            color: result.success ? "#065F46" : "#B91C1C",
            width: 320,
            textAlign: "center",
          }}
        >
          {result.success ? "✅ Valid ticket" : `❌ ${result.warning ?? result.error ?? "unknown error"}`}
        </Paper>
      )}
    </Stack>
    )
}