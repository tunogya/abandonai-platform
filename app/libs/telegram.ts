import {Readable} from "node:stream";

export const getFile = async (file_id: string, bot_token: string) => {
  try {
    const file = await fetch(`https://api.telegram.org/bot${bot_token}/getFile?file_id=${file_id}`).then(res => res.json());
    const file_path = file.result.file_path;
    const file_url = `https://api.telegram.org/file/bot${bot_token}/${file_path}`;
    // TODO: can save file to s3
    // ...

    return await fetch(file_url).then(res => res.arrayBuffer())
  } catch (e) {
    console.log(e)
    return null
  }
}

export const getFileAsStream = async (file_id: string, bot_token: string): Promise<Readable | null> => {
  try {
    const fileResponse = await fetch(`https://api.telegram.org/bot${bot_token}/getFile?file_id=${file_id}`);
    const file = await fileResponse.json();

    if (!file.ok) {
      throw new Error(`Failed to get file: ${file.description}`);
    }

    const file_path = file.result.file_path;
    const file_url = `https://api.telegram.org/file/bot${bot_token}/${file_path}`;

    // Fetch the file as a stream
    const response = await fetch(file_url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Return the response body as a ReadStream
     // Node.js >= 16
    return Readable.fromWeb(response.body as never);
  } catch (e) {
    console.error("Error fetching file:", e);
    return null;
  }
};