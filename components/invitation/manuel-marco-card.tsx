import { Card, Image, Text } from "@mantine/core";
import manuelMarco from "@/img/manuel_marco.jpg"

export default function ManuelMarcoCard() {
    return (
        <Card className="w-full" mt="md" radius="lg" shadow="md" p="0">
            <Image src={manuelMarco.src} h="200px"/>
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex">
                <Text c="white" className="absolute bottom-2 right-3 text-base font-semibold drop-shadow-md">Am 02.11 werden Manuel & Marco 20</Text>
            </div>
        </Card>
    )
}