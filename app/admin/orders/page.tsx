import OrdersTable from "@/components/orders/orders-table";
import { Stack, Title } from "@mantine/core";

export default function OrdersPage() {
    return (
        <Stack p="md">
            <Title>Orders</Title>
            <OrdersTable orders={[]}/>
        </Stack>
    )
}