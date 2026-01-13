"use client";
import { useOrderStore } from "@/libs/useOrderStore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@heroui/react";

const menuItems: Record<string, { src: string; description: string }> = {
  "เอสเพรสโซ": {
    src: "images/can.jpg",
    description: "กาแฟเข้มข้นรสชาติเต็มรูปแบบ",
  },
  "คาปูชิโน่": {
    src: "images/can.jpg",
    description: "เอสเพรสโซโฟมนมครีมมี่",
  },
  "ลาเต้": {
    src: "images/can.jpg",
    description: "กาแฟนมเนียนนุ่ม",
  },
  "อเมริกาโน่": {
    src: "images/can.jpg",
    description: "กาแฟดำคลาสสิก",
  },
};

export default function OrderModal() {
  const { isModalOpen, selectedItem, closeModal } = useOrderStore();

  const handleConfirm = () => {
    console.log("✅ Order confirmed:", selectedItem);
    // TODO: Add order processing logic here
    closeModal();
  };

  const itemDetails = menuItems[selectedItem];

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          ยืนยันออเดอร์
        </ModalHeader>
        <ModalBody>
          {itemDetails && (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={itemDetails.src}
                alt={selectedItem}
                className="size-64 object-cover rounded-2xl"
              />
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">{selectedItem}</h3>
                <p className="text-gray-600">{itemDetails.description}</p>
              </div>
            </div>
          )}
          {!itemDetails && (
            <p className="text-lg">
              คุณต้องการสั่ง <span className="font-semibold">{selectedItem}</span> ใช่หรือไม่?
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={closeModal}>
            ยกเลิก
          </Button>
          <Button color="primary" onPress={handleConfirm}>
            ยืนยันออเดอร์
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
