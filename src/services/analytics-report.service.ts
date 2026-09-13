import {
  api,
} from "@/lib/api";

import type {
  AnalyticsRange,
} from "@/types/analytics-filter";

/*
 * =========================================================
 * Filename helper
 * =========================================================
 */

function sanitizeFilename(
  value: string
) {
  return value
    .trim()
    .replace(
      /[^a-zA-Z0-9-_]+/g,
      "-"
    )
    .replace(
      /-+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}

/*
 * =========================================================
 * Download analytics PDF
 * =========================================================
 */

export async function downloadAnalyticsReport({
  storeId,
  storeName,
  range,
}: {
  storeId: string;

  storeName: string;

  range: AnalyticsRange;
}) {
  /*
   * IMPORTANT:
   *
   * Use the timezone already contained
   * inside AnalyticsRange.
   *
   * Do not resolve the browser timezone
   * again here because the downloaded PDF
   * must exactly match the analytics currently
   * displayed on the page.
   */

  const response =
    await api.get(
      `/analytics/stores/${storeId}/report.pdf`,
      {
        params: {
          preset:
            range.preset,

          from:
            range.from,

          to:
            range.to,

          timeZone:
            range.timeZone,
        },

        responseType:
          "blob",
      }
    );

  /*
   * =======================================================
   * Build PDF blob
   * =======================================================
   */

  const blob =
    new Blob(
      [
        response.data,
      ],
      {
        type:
          "application/pdf",
      }
    );

  /*
   * =======================================================
   * Temporary browser URL
   * =======================================================
   */

  const url =
    URL.createObjectURL(
      blob
    );

  const anchor =
    document.createElement(
      "a"
    );

  anchor.href =
    url;

  /*
   * =======================================================
   * Filename
   * =======================================================
   *
   * Example:
   *
   * valyou-saida-branch-2026-08-14-to-2026-09-12.pdf
   *
   * This works much better than:
   *
   * valyou-saida-branch-30-day-report.pdf
   *
   * because we now also support:
   *
   * this month
   * last month
   * custom ranges
   */

  const safeStoreName =
    sanitizeFilename(
      storeName ||
        "location"
    );

  anchor.download =
    `valyou-${safeStoreName}-${range.from}-to-${range.to}.pdf`;

  /*
   * =======================================================
   * Trigger download
   * =======================================================
   */

  document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();

  /*
   * Revoke on next tick so the browser
   * has enough time to begin the download.
   */

  setTimeout(
    () => {
      URL.revokeObjectURL(
        url
      );
    },
    0
  );
}