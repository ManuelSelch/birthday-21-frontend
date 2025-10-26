import InvitationCard from "@/components/invitation/invitation-card";
import InvitationHero from "@/components/invitation/invitation-hero";
import Footer from "@/components/footer";
import InvitationHeader from "@/components/invitation/invitation-header";

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-linear-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-6"
    >
      <InvitationHero />

      <div className="relative z-10 flex flex-col grow">
        <InvitationHeader />
        <InvitationCard />
        <Footer/>
      </div>
    </div>
  );
}
