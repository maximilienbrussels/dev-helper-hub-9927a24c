import { translate } from "@/lib/portal-i18n";
import { usePortal } from "@/lib/portal-store";

export function TasksPage() {
  const { lang } = usePortal();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{translate("nav.tasks", lang)}</h1>
      <p className="mt-2 text-muted-foreground">Task management coming soon.</p>
    </div>
  );
}
