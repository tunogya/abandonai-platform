import {NextRequest} from "next/server";
import {
  PutObjectCommand,
  S3Client, HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { Semaphore } from "async-mutex";

const s3Client = new S3Client({
  region: "us-east-1",
});

const BATCH_SIZE = 100; // 每次批量处理的任务数量
const MAX_CONCURRENT = 100; // 最大并行任务数
const semaphore = new Semaphore(MAX_CONCURRENT);

type POST_TYPE = {
  post_id: string,
  description: string,
  date_posted: string,
  post_url: string,
  photos: string[] | null,
  videos: string[] | null,
  replies: number | null,
  reposts: number | null,
  likes: number | null,
  views: number | null,
  hashtags: string[] | null,
}

export async function GET(req: NextRequest) {
  const username =  req.nextUrl.searchParams.get("username");
  if (!username) {
    return Response.json({
      ok: false,
      message: "Missing username",
    });
  }

  try {
    const endpoint = "https://open.abandon.ai/api/scraper/twitter";
    const data = await fetch(`https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwxmeb2u1cniijd7t4&endpoint=${endpoint}&auth_header=Bearer ${process.env.BRIGHT_API_KEY}&format=json&uncompressed_webhook=true&include_errors=true`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BRIGHT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{
        url: `https://x.com/${username}`,
        max_number_of_posts: 100,
      }]),
    }).then((res) => res.json())
    return Response.json({
      ok: true,
      snapshot_id: data.snapshot_id,
    })
  } catch (e) {
    return Response.json({
      error: e,
    });
  }
}

export async function POST(request: Request) {
  // check Authorization
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.BRIGHT_API_KEY}`) {
    return Response.json({
      ok: false,
      message: "Unauthorized",
    });
  }

  const checkAndUploadToS3 = async (id: string, post: POST_TYPE) => {
    const key = `datasets/x.com/${id}/${post.post_id}`;

    try {
      // 检查文件是否存在
      const exists = await s3Client.send(new HeadObjectCommand({
        Bucket: "abandon.ai",
        Key: key,
      }))
        .then(() => true)
        .catch(() => false);

      if (exists) {
        console.log("Exist:", id, post.post_id);
        return false;
      }

      // 文件不存在，上传
      await s3Client.send(new PutObjectCommand({
        Bucket: "abandon.ai",
        Key: key,
        ContentType: "application/json",
        Body: JSON.stringify(post),
      }));
      console.log("Uploaded:", id, post.post_id);
      return true;
    } catch (error) {
      console.error("Error processing:", id, post.post_id, error);
    }
  };

  const processBatch = async (batch: {id: string, post: POST_TYPE}[]) => {
    const tasks = batch.map(async ({ id, post }) => {
      const [, release] = await semaphore.acquire();
      try {
        await checkAndUploadToS3(id, post)
      } finally {
        release();
      }
    });

    await Promise.all(tasks);
  };

  const data = await request.json();
  console.log(data);
  for (const profile of data) {
    const posts = profile.posts || []
    const batch = [];
    if (posts?.length > 0) {
      const sort_posts = posts.sort((a: POST_TYPE, b: POST_TYPE) => Number(a.post_id) - Number(b.post_id))
      for (const post of sort_posts) {
        batch.push({ id: profile.id, post });

        // 如果达到了批量大小，处理当前批量
        if (batch.length >= BATCH_SIZE) {
          await processBatch(batch);
          batch.length = 0; // 清空批量任务
        }
      }
    }
  }

  return Response.json({
    ok: true,
  })
}