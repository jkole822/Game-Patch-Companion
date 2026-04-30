import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FieldGuidePanel, ResourceManagementLayout } from "@/components";
import { hasAuthCookie } from "@/lib/auth";

import { SOURCE_FIELD_GUIDE_SECTIONS } from "../_components/SourceFieldGuide";
import { SourceForm } from "../_components/SourceForm";

import { createSourceAction } from "./actions";

export default async function CreateSourcePage() {
  const cookieStore = await cookies();

  if (!hasAuthCookie(cookieStore)) {
    redirect("/login");
  }

  return (
    <ResourceManagementLayout
      description="Register a source for the ingest pipeline and keep patch discovery pointed at the right feeds."
      formEyebrow="Source details"
      formTitle="New ingest source"
      heading="Create source"
      supportCopy="Source creation is limited to admin accounts. The API will reject this submission when the signed-in user does not have access."
      sidebarContent={<FieldGuidePanel sections={SOURCE_FIELD_GUIDE_SECTIONS} />}
    >
      <SourceForm
        action={createSourceAction}
        cancelHref="/admin/sources"
        submitLabel="Create source"
      />
    </ResourceManagementLayout>
  );
}
