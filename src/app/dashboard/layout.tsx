import DashboardLayoutWrapper from "@/components/ui/DashboardLayoutWrapper";
import { AppDataProvider } from "@/context/AppDataContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppDataProvider>
      <DashboardLayoutWrapper>
        {children}
      </DashboardLayoutWrapper>
    </AppDataProvider>
  );
}
