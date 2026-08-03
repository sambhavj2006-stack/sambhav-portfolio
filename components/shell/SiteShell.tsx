import Navigation from "@/components/navigation/Navigation";
import PointerFieldProvider from "@/components/system/PointerFieldProvider";
import SectionCoordinateReadout from "@/components/system/SectionCoordinateReadout";

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PointerFieldProvider>
      <Navigation />
      {children}
      <SectionCoordinateReadout />
    </PointerFieldProvider>
  );
}
