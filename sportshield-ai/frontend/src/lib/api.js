import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 90000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);
    config._retryCount = config._retryCount || 0;
    if (
      config._retryCount < 2 &&
      (!error.response || error.response.status >= 500)
    ) {
      config._retryCount += 1;
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * config._retryCount),
      );
      return api(config);
    }
    return Promise.reject(error);
  },
);

// ── Asset Registration & Registry ──────────────────────────────
export const registerAsset = (formData) => api.post("/register/", formData);
export const getAssets = (params = {}) => api.get("/assets/", { params });
export const getAsset = (assetId) => api.get(`/assets/${assetId}`);
export const deleteAsset = (assetId, userUid) =>
  api.delete(`/assets/${assetId}`, { params: { user_uid: userUid } });

// ── Scan — Full / URL / Lite ───────────────────────────────────
export const scanContent = (formData) => api.post("/scan/", formData);
export const scanLite = (formData) => api.post("/scan/lite", formData);
export const scanByUrl = (url, userUid = "anonymous", language = "en") =>
  api.post("/scan/url", { url, user_uid: userUid, language });
export const getScanStatus = (scanId) => api.get(`/scan/${scanId}/status`);
export const getGeminiReport = (scanId, language) =>
  api.post(`/scan/${scanId}/legal-report`, { language });

// ── Violations ─────────────────────────────────────────────────
export const getViolations = (params = {}) =>
  api.get("/violations/", { params });
export const getViolationTimeline = (assetId) =>
  api.get(`/violations/${assetId}/timeline`);
export const sendTakedown = (violationId) =>
  api.post(`/violations/${violationId}/takedown`);
export const reportUrl = (url, assetId) =>
  api.post("/violations/report-url", { url, asset_id: assetId });
export const generateDMCA = (violationId, language = "en") =>
  api.post(`/violations/${violationId}/dmca`, { language });

// ── Analytics & Health ─────────────────────────────────────────
export const getAnalytics = () => api.get("/analytics/");
export const getHealth = () => api.get("/health");

// ── Web Crawl ──────────────────────────────────────────────────
export const crawlAsset = (assetId, maxResults = 10) =>
  api.post("/crawl/", { asset_id: assetId, max_results: maxResults });

// ── Evidence & Certificates ────────────────────────────────────
export const downloadReport = (scanId) =>
  api.get(`/evidence/${scanId}/report.pdf`, { responseType: "blob" });
export const getCertificatePdf = (assetId) =>
  api.get(`/evidence/${assetId}/certificate.pdf`, { responseType: "blob" });

export default api;
