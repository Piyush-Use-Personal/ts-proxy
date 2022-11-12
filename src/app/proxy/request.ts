// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Request, Response } from "express";
import fetch, { Headers } from "node-fetch";
import { IncomingHttpHeaders } from "http";

async function copyRequiredHeaders(incomingHeaders: IncomingHttpHeaders): Promise<Headers> {
  const localHeaders = new Headers();

  // Preserve the Accept header
  if (incomingHeaders["accept"]) {
    localHeaders.append("accept", incomingHeaders["accept"]);
  }

  // Preserve If-Match
  if (incomingHeaders["if-match"]) {
    localHeaders.append("if-match", incomingHeaders["if-match"]);
  }

  // Preserve Content-Type
  if (incomingHeaders["content-type"]) {
    localHeaders.append("content-type", incomingHeaders["content-type"]);
  }

  return localHeaders;
}
/**
 * Proxies the request to the Microsoft cosmos
 * @param {Request} req - The incoming request
 * @param {Response} res - The outgoing response
 * @returns {Promise<void>}
 */
export default async function proxyRequest(req: Request, res: Response): Promise<void> {
  const url = req.path.replace("/proxy", ``);
  const domain = 'https://reqres.in/api'
  const newUrl = `${domain}${url}`;
  const headers = await copyRequiredHeaders(req.headers);
  const authData = {
    token: 'attached custom token', // amy data you required
    date: new Date().toUTCString()
  }

  const response = await fetch(newUrl, {
    method: req.method,
    headers: {
      ...headers,
      Authorization: authData.token,
      "x-version": "2016-07-11",
      "x-date": authData.date,
    },
    body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
  });

  const responseType = response.headers.get("content-type") ?? "application/json";
  const bodyData = await response.buffer();
  res
    .status(response.status)
    .type(responseType)
    .set({
      "request-id": response.headers.get("request-id"),
      "client-request-id": response.headers.get("client-request-id"),
    })
    .send(bodyData);
}