import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { ResourceManagementLayout } from "@/components";
import { getAuthCookieHeader, hasAuthCookie } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/utils";

import { SourceFieldGuidePanel } from "../../_components/SourceFieldGuidePanel";
import { SourceForm } from "../../_components/SourceForm";

import { deleteSourceAction, updateSourceAction } from "./actions";

import type { SourceRecord } from "../../_components/SourceForm.types";

const getSource = async (sourceId: string): Promise<SourceRecord> => {
  const cookieStore = await cookies();
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    redirect("/login");
  }

  const response = await fetch(`${getApiBaseUrl()}/sources/find-one/${sourceId}`, {
    headers: {
      Cookie: authCookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load source.");
  }

  return (await response.json()) as SourceRecord;
};

export default async function EditSourcePage({
  params,
}: {
  params: Promise<{ sourceId: string }>;
}) {
  const cookieStore = await cookies();

  if (!hasAuthCookie(cookieStore)) {
    redirect("/login");
  }

  const { sourceId } = await params;
  const source = await getSource(sourceId);

  return (
    <ResourceManagementLayout
      description="Update an existing ingest source without rebuilding the entire config from scratch."
      formEyebrow="Source details"
      formTitle="Edit ingest source"
      heading="Edit source"
      supportCopy="Source updates and deletions are limited to admin accounts. The API will reject these actions when the signed-in user does not have access."
      sidebarContent={<SourceFieldGuidePanel />}
    >
      <SourceForm
        action={updateSourceAction.bind(null, sourceId)}
        cancelHref="/admin/sources"
        deleteAction={deleteSourceAction.bind(null, sourceId)}
        initialSource={source}
        submitLabel="Save changes"
      />
    </ResourceManagementLayout>
  );
}
