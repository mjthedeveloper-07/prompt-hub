import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "PromptHub | Free AI Prompt Library & Resume Builder", 
  description = "A stunning, curated library of the best AI prompts for Business, Productivity, SEO, and Design. Plus, a free, 3-step AI Resume Builder.", 
  keywords = "AI prompts, free prompt library, chatgpt prompts, resume builder, AI resume generator, best chatgpt prompts",
  url = "https://prompthub.ai",
  schema = null
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}/og-image.jpg`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${url}/og-image.jpg`} />
      
      <link rel="canonical" href={url} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
