import InvitationCard from "@/components/invitation/invitation-card";
import Footer from "@/components/footer";
import InvitationHeader from "@/components/invitation/invitation-header";

export default function Home() {
  return (
    <div>
      <InvitationHeader />
      <InvitationCard />
      <Footer/>
    </div>
  );
}
