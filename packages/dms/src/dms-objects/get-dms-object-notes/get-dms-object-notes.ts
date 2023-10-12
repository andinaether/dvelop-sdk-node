import { _defaultHttpRequestFunction, HttpConfig, HttpResponse } from "../../utils/http";
import { DvelopContext } from "../../index";

/**
 * Parameters for the {@link getDmsObjectNotes}-function.
 * @category DmsObject
 */
export interface GetDmsObjectNotesParams {
  /** ID of the repository */
  repositoryId: string;
  /** ID of the DmsObject */
  dmsObjectId: string;
}

/**
 * Result type for the {@link getDmsObjectNotes}-function.
 * @category DmsObject
 */
export interface DmsObjectNotes {
  /** ID of the repository */
  repositoryId: string;
  /** ID of the DmsObject */
  dmsObjectId: string;
  /* Notes of the DmsObject */
  notes: SingleDmsObjectNote[];
}

/**
 * All information provided for a single note for the {@link DmsObjectNotes}-interface.
 * @category DmsObject
 */
export interface SingleDmsObjectNote {
  /* Creator of the DmsObjectNotes */
  creator: {
    /* ID of the creator of the note */
    id: string;
    /* DisplayName is the full name of the creator */
    displayName: string;
  },
  /* Text of the note */
  text: string;
  /* Creation date of the note */
  created: Date;
}

/**
 * Default transform-function provided to the {@link getDmsObjectNotes}-function. See [Advanced Topics](https://github.com/d-velop/dvelop-sdk-node#advanced-topics) for more information.
 * @internal
 * @category DmsObject
 */
export function _getDmsObjectNotesDefaultTransformFunction(response: HttpResponse<any>, context: DvelopContext, params: GetDmsObjectNotesParams) {
  const mappedNotes = response.data.notes.map((note: SingleDmsObjectNote) => {
    return {
      creator: {
        id: note.creator.id,
        displayName: note.creator.displayName
      },
      text: note.text,
      created: new Date(note.created)
    };
  });

  return {
    repositoryId: params.repositoryId,
    dmsObjectId: params.dmsObjectId,
    notes: mappedNotes
  };
}

/**
 * Factory for the {@link getDmsObjectNotes}-function. See [Advanced Topics](https://github.com/d-velop/dvelop-sdk-node#advanced-topics) for more information.
 * @typeparam T Return type of the {@link getDmsObjectNotes}-function. A corresponding transformFunction has to be supplied.
 * @category DmsObject
 */
export function _getDmsObjectNotesFactory<T>(
  httpRequestFunction: (context: DvelopContext, config: HttpConfig) => Promise<HttpResponse>,
  transformFunction: (response: HttpResponse, context: DvelopContext, params: GetDmsObjectNotesParams) => T
): (context: DvelopContext, params: GetDmsObjectNotesParams) => Promise<T> {
  return async (context: DvelopContext, params: GetDmsObjectNotesParams) => {
    const response: HttpResponse = await httpRequestFunction(context, {
      method: "GET",
      url: "/dms",
      follows: ["repo", "dmsobjectwithmapping", "notes"],
      templates: {
        "repositoryid": params.repositoryId,
        "dmsobjectid": params.dmsObjectId
      }
    });

    return transformFunction(response, context, params);
  };
}

/**
 * Get all notes for an existing DmsObject.
 *
 * ```typescript
 * import { getDmsObjectNotes } from "@dvelop-sdk/dms";
 *
 * await getDmsObjectNotes({
 *   systemBaseUri: "https://steamwheedle-cartel.d-velop.cloud",
 *   authSessionId: "dQw4w9WgXcQ"
 * }, {
 *   repositoryId: "qnydFmqHuVo",
 *   dmsObjectId: "GDYQ3PJKrT8"
 * });
 * ```
 *
 * @category DmsObject
 */
/* istanbul ignore next */
export async function getDmsObjectNotes(context: DvelopContext, params: GetDmsObjectNotesParams): Promise<DmsObjectNotes> {
  return await _getDmsObjectNotesFactory(_defaultHttpRequestFunction, _getDmsObjectNotesDefaultTransformFunction)(context, params);
}