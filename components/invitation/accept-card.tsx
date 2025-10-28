import { Button, Stack, Text } from "@mantine/core";

export default function AcceptCard({loading, confirmAttendance, error}: {loading: any, confirmAttendance: any, error: any}) {
    return (
        <Stack align="center">
            <Button
                color="yellow"
                radius="md"
                size="lg"
                w="300px"
                loading={loading}
                onClick={confirmAttendance}
                className="transition-transform transform hover:scale-105"
            >
                Teilnahme bestätigen
            </Button>

            {error && <Text c="red">{error}</Text>}
        </Stack>
    )
}