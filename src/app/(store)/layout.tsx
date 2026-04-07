import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { WelcomePopup } from "@/components/WelcomePopup";
import { WhatsappButton } from "@/components/WhatsappButton";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WelcomePopup />
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />
      {children}
      <WhatsappButton />
      <Footer />
    </>
  );
}
