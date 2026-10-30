import axios from "axios";
import * as staticApi from "./staticExpressionsApi";

const isStaticSite = import.meta.env.VITE_STATIC_SITE === "true";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

const aiApi = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

function unwrapError(error) {
  return (
    error?.response?.data?.error ||
    error?.message ||
    "请求失败，请重试。"
  );
}

export async function getExpressions(page = 1, limit = 50, status = null) {
  if (isStaticSite) return staticApi.getExpressions(page, limit, status);
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await api.get("/expressions", { params });
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getNextExpression() {
  if (isStaticSite) return staticApi.getNextExpression();
  try {
    const response = await api.get("/expressions/next");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getRandomExpression() {
  if (isStaticSite) return staticApi.getRandomExpression();
  try {
    const response = await api.get("/expressions/random");
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getExpressionById(id) {
  if (isStaticSite) return staticApi.getExpressionById(id);
  try {
    const response = await api.get(`/expressions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function updateExpressionStatus(id, status) {
  if (isStaticSite) return staticApi.updateExpressionStatus(id, status);
  try {
    const response = await api.put(`/expressions/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function saveExpressionNote(id, note) {
  if (isStaticSite) return staticApi.saveExpressionNote(id, note);
  try {
    const response = await api.put(`/expressions/${id}/note`, { note });
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getExpressionByKorean(korean) {
  if (isStaticSite) return staticApi.getExpressionByKorean(korean);
  try {
    const response = await api.get("/expressions/lookup", { params: { korean } });
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}

export async function getRewriteFeedback(id, userSentence) {
  if (isStaticSite) return staticApi.getRewriteFeedback(id, userSentence);
  try {
    const response = await aiApi.post(`/expressions/${id}/feedback`, { userSentence });
    return response.data;
  } catch (error) {
    throw new Error(unwrapError(error));
  }
}
