# Vercel Blob Setup Instructions

## Environment Variable Required

To use Vercel Blob for file uploads, you need to set up the following environment variable:

### `BLOB_READ_WRITE_TOKEN`

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add a new environment variable:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: Your Vercel Blob token (get this from Vercel Blob settings)
   - Environment: Production, Preview, Development (select all)

## Local Development

For local development, create a `.env.local` file in your project root with:

```
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

## How It Works

The upload API now uses Vercel Blob instead of the local file system, which resolves the "EROFS: read-only file system" error in production. Files are uploaded to Vercel's cloud storage and return a public URL that can be used directly in your application.

## Migration Notes

- Existing files in `/public/uploads/` will continue to work
- New uploads will be stored in Vercel Blob
- The API response format remains the same, but URLs will point to Vercel Blob storage
