# MinIO Setup Guide

## Initial Setup

### Step 1: Access MinIO Console

1. Start Docker services:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Open your browser and navigate to: `http://localhost:9001`
3. Login with:
   - Username: `minioadmin` (or your `MINIO_ROOT_USER` env var)
   - Password: `minioadmin` (or your `MINIO_ROOT_PASSWORD` env var)

### Step 2: Create Bucket

1. Click "Create Bucket" button
2. Bucket name: `blog-images` (must match `S3_BUCKET_NAME` in your .env)
3. Enable "Versioning" (optional, for production)
4. Click "Create bucket"

### Step 3: Configure Bucket Policy (Public Read Access)

1. Click on the bucket name
2. Go to "Access Policy" tab
3. Select "Public" or "Custom" policy
4. For public read access, use this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["*"]
      },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::blog-images/*"]
    }
  ]
}
```

5. Click "Save"

### Step 4: Environment Variables

Make sure your `.env` file includes:

```env
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=blog-images
S3_REGION=us-east-1
```

For production:
- Use secure credentials (change from default `minioadmin`)
- Use HTTPS endpoint
- Configure proper bucket policies
- Consider using IAM policies for fine-grained access control

## Testing Upload

The ImageUpload component will automatically:
1. Request a presigned URL from `/api/upload/presigned`
2. Upload the file directly to MinIO
3. Return the public URL for use in blog posts

## Troubleshooting

- **Upload fails**: Check MinIO is running and bucket exists
- **Images not loading**: Verify bucket policy allows public read access
- **CORS errors**: Configure CORS in MinIO console if accessing from different domain

