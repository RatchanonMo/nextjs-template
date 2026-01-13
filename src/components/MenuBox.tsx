"use client";
import { useOrderStore } from "@/libs/useOrderStore";
import { Card, CardBody, Image } from "@heroui/react";

const menuItems = [
  {
    id: 1,
    src: "images/espresso.png",
    name: "เอสเพรสโซ",
    description: "กาแฟเข้มข้นรสชาติเต็มรูปแบบ",
  },
  {
    id: 2,
    src: "images/cappuccino.png",
    name: "คาปูชิโน่",
    description: "เอสเพรสโซโฟมนมครีมมี่",
  },
  {
    id: 3,
    src: "images/latte.png",
    name: "ลาเต้",
    description: "กาแฟนมเนียนนุ่ม",
  },
  {
    id: 4,
    src: "images/americano.png",
    name: "อเมริกาโน่",
    description: "กาแฟดำคลาสสิก",
  },
];

export default function MenuBox() {
  const { openModal } = useOrderStore();

  return (
    <Card className="shadow-none rounded-4xl p-5">
      <CardBody className="grid grid-cols-4 gap-5">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openModal(item.name)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <Image
              src={item.src}
              alt={item.name}
              className="w-full object-cover rounded-4xl"
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
