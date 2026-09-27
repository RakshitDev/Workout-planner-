const TIMEOUT = 10000;

export const doGetRequest = async (url) => {
  try {
    console.log("GET:", url);

    const response = await fetch(url, {
      method: "GET",
      // GET has no body, so ask for JSON with Accept (Content-Type would add a CORS preflight request)
      headers: {
        Accept: "application/json",
      },
      // fetch has no `timeout` option: abort the request after TIMEOUT ms instead
      signal: AbortSignal.timeout(TIMEOUT),
    });

    // fetch only throws on network errors, not on 404/500, so check the status
    if (!response.ok) {
      throw new Error(`GET ${url} failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("GET Error:", error);
    throw error;
  }
};
