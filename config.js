/* Public website configuration. Keep secret API keys out of this file. */
window.AKSHARAS_CONFIG = {
  /* Set to a server-side endpoint that returns verified Google reviews.
     Expected response: [{ rating: 5, text: "...", author: "...", relativeTime: "..." }]
     The page independently filters rating === 5 before rendering. */
  reviewsEndpoint: "",
  /* Set to a server-side endpoint that validates and stores party enquiries. */
  partyEnquiryEndpoint: "",
  /* Current ordering link shown on the existing website. */
  orderUrl: "https://crossroads.dotpe.in"
};
