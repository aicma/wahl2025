export async function fetchCsv(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(
      `Network or CORS failure fetching CSV from "${url}": ${err instanceof Error ? err.message : String(err)
      }`, {
      cause: err,
    }
    );
  }
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} fetching CSV from "${url}"`, {
      cause: response.status >= 500 ? "server" : "client",
    }
    );
  }
  return response.text();
}
