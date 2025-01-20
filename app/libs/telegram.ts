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