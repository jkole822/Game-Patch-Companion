"use client";

import { Bomb, CheckCircle2 } from "lucide-react";
import { useActionState, useState } from "react";

import { Button, Checkbox, SelectField, TextField } from "@/components";

import { createSourceAction } from "./actions";
import { SOURCE_CREATE_FIELD_GUIDE } from "./fieldGuide";
import { INITIAL_CREATE_SOURCE_STATE } from "./types";

export const SourceCreateForm = () => {
  const [state, formAction, pending] = useActionState(
    createSourceAction,
    INITIAL_CREATE_SOURCE_STATE,
  );
  const [sourceType, setSourceType] = useState("html");

  return (
    <form action={formAction} className="space-y-7">
      {state.error && (
        <p className="text-danger border-danger/40 bg-danger/10 flex items-center gap-2 border px-3 py-2 text-sm">
          <Bomb size={14} />
          <span>{state.error}</span>
        </p>
      )}

      {state.success && (
        <p className="text-success border-success/40 bg-success/10 flex items-center gap-2 border px-3 py-2 text-sm">
          <CheckCircle2 size={14} />
          <span>{state.success}</span>
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          aria-describedby={SOURCE_CREATE_FIELD_GUIDE.name.id}
          label="Name"
          name="name"
          required
          type="text"
          validationMessages={{
            valueMissing: "Name is required.",
          }}
        />
        <TextField
          aria-describedby={SOURCE_CREATE_FIELD_GUIDE.key.id}
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
          aria-describedby={SOURCE_CREATE_FIELD_GUIDE.baseUrl.id}
          className="md:col-span-2"
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
          aria-describedby={SOURCE_CREATE_FIELD_GUIDE.type.id}
          label="Type"
          name="type"
          onChange={setSourceType}
          value={sourceType}
        >
          <option value="html">HTML</option>
          <option value="rss">RSS</option>
          <option value="api">API</option>
        </SelectField>

        <Checkbox
          aria-describedby={SOURCE_CREATE_FIELD_GUIDE.isEnabled.id}
          defaultChecked
          label="Enabled"
          name="isEnabled"
        />
      </div>

      {sourceType === "html" ? (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.listPath.id}
              label="List path"
              name="listPath"
              required
              type="text"
              validationMessages={{
                valueMissing: "List path is required.",
              }}
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.entrySelector.id}
              label="Entry selector"
              name="entrySelector"
              required
              type="text"
              validationMessages={{
                valueMissing: "Entry selector is required.",
              }}
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.titleSelector.id}
              label="Title selector"
              name="titleSelector"
              required
              type="text"
              validationMessages={{
                valueMissing: "Title selector is required.",
              }}
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.linkSelector.id}
              label="Link selector"
              name="linkSelector"
              type="text"
              defaultValue="a"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.publishedAtSelector.id}
              label="Published selector"
              name="publishedAtSelector"
              type="text"
              defaultValue="time[datetime]"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.publishedAtAttribute.id}
              label="Published attribute"
              name="publishedAtAttribute"
              type="text"
              defaultValue="datetime"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.contentSelector.id}
              className="md:col-span-2"
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
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.contentFormat.id}
              defaultValue="markdown"
              label="Content format"
              name="contentFormat"
            >
              <option value="markdown">Markdown</option>
              <option value="lines">Lines</option>
            </SelectField>

            <SelectField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.structureMode.id}
              defaultValue=""
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
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.includeTitleRegex.id}
              label="Include title regex"
              name="includeTitleRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.excludeTitleRegex.id}
              label="Exclude title regex"
              name="excludeTitleRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.publishedAtRegex.id}
              label="Published regex"
              name="publishedAtRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.versionRegex.id}
              label="Version regex"
              name="versionRegex"
              type="text"
            />
            <TextField
              aria-describedby={SOURCE_CREATE_FIELD_GUIDE.region.id}
              className="md:col-span-2"
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
            className="border-border bg-background/70 text-text focus:border-primary-light aria-[invalid=true]:border-danger min-h-40 resize-y rounded-xl border px-4 py-3 font-mono text-sm transition outline-none"
            defaultValue="{}"
            name="configJson"
            spellCheck={false}
          />
        </label>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Button href="/dashboard">Cancel</Button>
        <Button loading={pending} type="submit">
          Create source
        </Button>
      </div>
    </form>
  );
};
