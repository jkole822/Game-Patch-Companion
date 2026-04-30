"use client";

import { useActionState, useState } from "react";

import { Button, Checkbox, DeleteModal, FormMessage, SelectField, TextField } from "@/components";

import { SOURCE_FIELD_GUIDE } from "./SourceFieldGuide";
import { INITIAL_SOURCE_ACTION_STATE } from "./SourceForm.types";
import { getConfigJsonValue, getInitialSourceType } from "./SourceForm.utils";

import type { SourceActionState, SourceRecord } from "./SourceForm.types";

const noopSourceAction = async (
  state: SourceActionState | undefined,
  _formData: FormData,
): Promise<SourceActionState> => state ?? INITIAL_SOURCE_ACTION_STATE;

type SourceFormProps = {
  action: (state: SourceActionState | undefined, formData: FormData) => Promise<SourceActionState>;
  cancelHref?: string;
  deleteAction?: (
    state: SourceActionState | undefined,
    formData: FormData,
  ) => Promise<SourceActionState>;
  initialSource?: SourceRecord;
  submitLabel: string;
};

export const SourceForm = ({
  action,
  cancelHref = "/dashboard",
  deleteAction,
  initialSource,
  submitLabel,
}: SourceFormProps) => {
  const [state, formAction, pending] = useActionState(action, INITIAL_SOURCE_ACTION_STATE);
  const [deleteState, deleteFormAction, deletePending] = useActionState(
    deleteAction ?? noopSourceAction,
    INITIAL_SOURCE_ACTION_STATE,
  );
  const [sourceType, setSourceType] = useState(getInitialSourceType(initialSource));

  return (
    <form action={formAction} className="space-y-7">
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          aria-describedby={SOURCE_FIELD_GUIDE.name.id}
          defaultValue={initialSource?.name}
          label="Name"
          name="name"
          required
          type="text"
          validationMessages={{
            valueMissing: "Name is required.",
          }}
        />
        <TextField
          aria-describedby={SOURCE_FIELD_GUIDE.key.id}
          defaultValue={initialSource?.key}
          label="Key"
          name="key"
          pattern="[a-z0-9-]+"
          required
          type="text"
          validationMessages={{
            patternMismatch: "Use lowercase letters, numbers, and hyphens only.",
            valueMissing: "Key is required.",
          }}
        />
        <TextField
          aria-describedby={SOURCE_FIELD_GUIDE.baseUrl.id}
          className="md:col-span-2"
          defaultValue={initialSource?.baseUrl}
          label="Base URL"
          name="baseUrl"
          required
          type="url"
          validationMessages={{
            typeMismatch: "Enter a valid base URL.",
            valueMissing: "Base URL is required.",
          }}
        />

        <SelectField
          aria-describedby={SOURCE_FIELD_GUIDE.type.id}
          label="Type"
          name="type"
          onChange={(value: string) => setSourceType(value as SourceRecord["type"])}
          value={sourceType}
        >
          <option value="html">HTML</option>
          <option value="rss">RSS</option>
          <option value="api">API</option>
        </SelectField>

        <Checkbox
          aria-describedby={SOURCE_FIELD_GUIDE.isEnabled.id}
          defaultChecked={initialSource?.isEnabled ?? true}
          label="Enabled"
          name="isEnabled"
        />
      </div>

      {sourceType === "html" ? (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.listPath.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.listPath : undefined
              }
              label="List path"
              name="listPath"
              required
              type="text"
              validationMessages={{
                valueMissing: "List path is required.",
              }}
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.entrySelector.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.entrySelector : undefined
              }
              label="Entry selector"
              name="entrySelector"
              required
              type="text"
              validationMessages={{
                valueMissing: "Entry selector is required.",
              }}
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.titleSelector.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.titleSelector : undefined
              }
              label="Title selector"
              name="titleSelector"
              required
              type="text"
              validationMessages={{
                valueMissing: "Title selector is required.",
              }}
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.linkSelector.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.linkSelector : "a"
              }
              label="Link selector"
              name="linkSelector"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.publishedAtSelector.id}
              defaultValue={
                initialSource?.type === "html"
                  ? initialSource.config.publishedAtSelector
                  : "time[datetime]"
              }
              label="Published selector"
              name="publishedAtSelector"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.publishedAtAttribute.id}
              defaultValue={
                initialSource?.type === "html"
                  ? initialSource.config.publishedAtAttribute
                  : "datetime"
              }
              label="Published attribute"
              name="publishedAtAttribute"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.contentSelector.id}
              className="md:col-span-2"
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.contentSelector : undefined
              }
              label="Content selector"
              name="contentSelector"
              required
              type="text"
              validationMessages={{
                valueMissing: "Content selector is required.",
              }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              aria-describedby={SOURCE_FIELD_GUIDE.contentFormat.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.contentFormat : "markdown"
              }
              label="Content format"
              name="contentFormat"
            >
              <option value="markdown">Markdown</option>
              <option value="lines">Lines</option>
            </SelectField>

            <SelectField
              aria-describedby={SOURCE_FIELD_GUIDE.structureMode.id}
              defaultValue={
                initialSource?.type === "html" ? (initialSource.config.structureMode ?? "") : ""
              }
              label="Structure mode"
              name="structureMode"
            >
              <option value="">Default</option>
              <option value="headings+lists">Headings and lists</option>
              <option value="nestedLists">Nested lists</option>
            </SelectField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.includeTitleRegex.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.includeTitleRegex : undefined
              }
              label="Include title regex"
              name="includeTitleRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.excludeTitleRegex.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.excludeTitleRegex : undefined
              }
              label="Exclude title regex"
              name="excludeTitleRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.publishedAtRegex.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.publishedAtRegex : undefined
              }
              label="Published regex"
              name="publishedAtRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.versionRegex.id}
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.versionRegex : undefined
              }
              label="Version regex"
              name="versionRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_FIELD_GUIDE.region.id}
              className="md:col-span-2"
              defaultValue={
                initialSource?.type === "html" ? initialSource.config.region : undefined
              }
              label="Region"
              name="region"
              type="text"
            />
          </div>
        </div>
      ) : (
        <label className="text-text flex flex-col gap-2 text-sm font-semibold">
          Config JSON
          <textarea
            aria-describedby={SOURCE_FIELD_GUIDE.configJson.id}
            className="border-border bg-background/70 text-text focus:border-primary-light aria-[invalid=true]:border-danger min-h-40 resize-y rounded-xl border px-4 py-3 font-mono text-sm transition outline-none"
            defaultValue={getConfigJsonValue(initialSource)}
            name="configJson"
            spellCheck={false}
          />
        </label>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {deleteAction && initialSource ? (
          <DeleteModal
            errorMessage={
              deleteState.error ? (
                <p className="text-danger border-danger/40 bg-danger/10 border px-3 py-2 text-sm">
                  {deleteState.error}
                </p>
              ) : undefined
            }
            formAction={deleteFormAction}
            itemName={initialSource.name}
            pending={deletePending}
            resourceLabel="source"
          />
        ) : (
          <div />
        )}

        <div className="flex flex-wrap justify-end gap-3">
          <Button href={cancelHref}>Cancel</Button>
          <Button loading={pending} type="submit">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
