import { useState } from 'react';
import RetryHandler from '../utils/RetryHandler';

/**
   * Helper class for resumable uploads using XHR/CORS. Can upload any Blob-like item, whether
   * files or in-memory constructs.
   *
   * @example
   * var content = new Blob(["Hello world"], {"type": "text/plain"});
   * var uploader = new MediaUploader({
   *   file: content,
   *   token: accessToken,
   *   onComplete: function(data) { ... }
   *   onError: function(data) { ... }
   * });
   * uploader.upload();
   *
   * @constructor
   * @param {object} options Hash of options
   * @param {string} options.token Access token
   * @param {blob} options.file Blob-like item to upload
   * @param {string} [options.fileId] ID of file if replacing
   * @param {object} [options.params] Additional query parameters
   * @param {string} [options.contentType] Content-type, if overriding the type of the blob.
   * @param {object} [options.metadata] File metadata
   * @param {function} [options.onComplete] Callback for when upload is complete
   * @param {function} [options.onProgress] Callback for status for the in-progress upload
   * @param {function} [options.onError] Callback if upload fails
   */
  const noop = function () {};

  interface UploadOptions {
    token: string;
    file: Blob | File;
    fileId?: string;
    params?: Record<string, string>;
    contentType?: string;
    metadata?: Record<string, any>;
    onComplete?: (response: any) => void;
    onProgress?: (event: ProgressEvent) => void;
    onError?: (error: any) => void;
    [key: string]: any; // Index signature for additional options
  }

  function getFileName(file: Blob | File): string | undefined {
    if (file instanceof File) {
      return file.name;
    }
    return undefined; // or return a default name if needed
  }
  
  function getFileSize(file: Blob | File | null): number | undefined {
    if (file) {
      return file.size;
    }
    return undefined;
  }

  const MediaUploader = (options: UploadOptions) => {
      
    const [token, setToken] = useState<string>(options.token);
    const [file, setFile] = useState<Blob | File>(options.file);
    const [fileId, setFileId] = useState<string | undefined>(options.fileId);
    const [contentType, setContentType] = useState<string>(options.contentType || 'application/octet-stream');  
    const [metadata, setMetadata] = useState<Record<string, any>>(options.metadata || {
      title: getFileName(file), 
      mimeType: contentType
    });
    const [onComplete, setOnComplete] = useState<(response: any) => void>(options.onComplete || noop);
    const [onProgress, setOnProgress] = useState<(event: ProgressEvent) => void>(options.onProgress || noop);

    const [onError, setOnError] = useState<(error: any) => void>(options.onError || noop);
    const [offset, setOffset] = useState<number>(options.offset || 0);
    const [chunkSize, setChunkSize] = useState<number>(options.chunkSize || 0);
    const [retryHandler, setRetryHandler] = useState<RetryHandler>(new RetryHandler());
    const [url, setUrl] = useState<string>(options.url);

    if (!url) {
      const params = options.params || {};
      params.uploadType = "resumable";
      setUrl(buildUrl_(fileId, params, options.baseUrl));
    }
    const httpMethod = options.fileId ? "PATCH" : "POST";
    console.log('MediaUploader.upload: httpMethod:', httpMethod);


  
  /**
   * Initiate the upload.
   */
  const upload = function () {
    var xhr = new XMLHttpRequest();
  
    xhr.open(httpMethod, url, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-Type", "application/json");
    const fileSize = getFileSize(file);
    if (fileSize !== undefined) {
      xhr.setRequestHeader("X-Upload-Content-Length", fileSize.toString());
    }
    xhr.setRequestHeader("X-Upload-Content-Type", contentType[0]);
  
    xhr.onload = function (e: any) {
      if (e.target.status < 400) {
        var location = e.target.getResponseHeader("Location");
        setUrl(location);
        sendFile_();
      } else {
        onUploadError_(e);
      }
    };
    xhr.onerror = onUploadError_;
    xhr.send(JSON.stringify(metadata));
  };
  
  /**
   * Send the actual file content.
   *
   * @private
   */
  const sendFile_ = function () {
    var content = file;
    var end = file.size;
  
    if (offset || chunkSize) {
      // Only bother to slice the file if we're either resuming or uploading in chunks
      if (chunkSize) {
        end = Math.min(offset + chunkSize, file.size);
      }
      content = content.slice(offset, end);
    }
  
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader(
      "Content-Range",
      "bytes " + offset + "-" + (end - 1) + "/" + file.size
    );
    xhr.setRequestHeader("X-Upload-Content-Type", file.type);
    if (xhr.upload) {
      xhr.upload.addEventListener("progress", onProgress);
    }
    xhr.onload = onContentUploadSuccess_;
    xhr.onerror = onContentUploadError_;
    xhr.send(content);
  };
  
  /**
   * Query for the state of the file for resumption.
   *
   * @private
   */
  function resume_() {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Range", "bytes */" + getFileSize(file));
    xhr.setRequestHeader("X-Upload-Content-Type", file.type);
    if (xhr.upload) {
      xhr.upload.addEventListener("progress", onProgress);
    }
    xhr.onload = onContentUploadSuccess_;
    xhr.onerror = onContentUploadError_;
    xhr.send();
  };
  
  /**
   * Extract the last saved range if available in the request.
   *
   * @param {XMLHttpRequest} xhr Request object
   */
  function extractRange_(xhr: XMLHttpRequest) {
    var range = xhr.getResponseHeader("Range");
    if (range) {
      setOffset(parseInt(range.match(/\d+/g)!.pop()!, 10) + 1);
    }
  };
  
  /**
   * Handle successful responses for uploads. Depending on the context,
   * may continue with uploading the next chunk of the file or, if complete,
   * invokes the caller's callback.
   *
   * @private
   * @param {object} e XHR event
   */
  function onContentUploadSuccess_(e: any) {
    if (e.target.status == 200 || e.target.status == 201) {
      onComplete(e.target.response);
    } else if (e.target.status == 308) {
      extractRange_(e.target);
      retryHandler.reset();
      sendFile_();
    } else {
      onContentUploadError_(e);
    }
  };
  
  /**
   * Handles errors for uploads. Either retries or aborts depending
   * on the error.
   *
   * @private
   * @param {object} e XHR event
   */
  function onContentUploadError_(e: any) {
    if (e.target.status && e.target.status < 500) {
      onError(e.target.response);
    } else {
      retryHandler.retry(resume_);
    }
  };
  
  /**
   * Handles errors for the initial request.
   *
   * @private
   * @param {object} e XHR event
   */
  function onUploadError_(e: any) {
    onError(e.target.response); // TODO - Retries for initial upload
  };
  
  /**
   * Construct a query string from a hash/object
   *
   * @private
   * @param {object} [params] Key/value pairs for query string
   * @return {string} query string
   */
  function buildQuery_(params: Record<string, string>) {
    params = params || {};
    return Object.keys(params)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
  };
  
  /**
   * Build the drive upload URL
   *
   * @private
   * @param {string} [id] File ID if replacing
   * @param {object} [params] Query parameters
   * @return {string} URL
   */
  function buildUrl_(id: string | undefined, params: Record<string, string>, baseUrl: string) {
    var url = baseUrl || "https://www.googleapis.com/upload/drive/v2/files/";
    if (id) {
      url += id;
    }
    var query = buildQuery_(params);
    if (query) {
      url += "?" + query;
    }
    return url;
  };
};
  