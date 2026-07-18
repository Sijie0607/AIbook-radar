import { useEffect, useMemo, useState } from "react";
import {
  clearRecommendationDraft,
  getRecommendationDraft,
  getRecommendationRecords,
  insertRecommendation,
  saveRecommendationDraft,
} from "../services/recommendationsService";
import type {
  BookRecommendationDraft,
  BookRecommendationRecord,
  RecommendationSubmitState,
  RecommendationValidationErrors,
} from "../types/recommendation";
import { createEmptyRecommendationDraft } from "../types/recommendation";
import {
  isRadarDomain,
  isRecommendationDraftSubmittable,
  validateRecommendationDraft,
} from "../utils/recommendationValidation";

export function useBookRecommendation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState(false);
  const [draft, setDraft] = useState<BookRecommendationDraft>(createEmptyRecommendationDraft);
  const [records, setRecords] = useState<BookRecommendationRecord[]>([]);
  const [latestSubmittedId, setLatestSubmittedId] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<RecommendationSubmitState>("idle");
  const [validationErrors, setValidationErrors] = useState<RecommendationValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setRecords(getRecommendationRecords());
    setDraft(getRecommendationDraft());
  }, []);

  const canSubmit = useMemo(
    () => isRecommendationDraftSubmittable(draft, records),
    [draft, records],
  );

  const visibleErrors = showValidation ? validationErrors : {};

  function openDrawer(resetDraft = false) {
    const nextDraft = resetDraft ? createEmptyRecommendationDraft() : getRecommendationDraft();
    if (resetDraft) {
      clearRecommendationDraft();
    }
    setDraft(nextDraft);
    setShowValidation(false);
    setValidationErrors({});
    setSubmitError(null);
    setSubmitState("editing");
    setIsDrawerOpen(true);
  }

  function closeDrawer() {
    try {
      saveRecommendationDraft(draft);
    } catch {
      // 关闭时若本地存储失败，仍允许回到雷达浏览
    }
    setIsDrawerOpen(false);
    setSubmitState("idle");
    setSubmitError(null);
  }

  function updateDraft(next: BookRecommendationDraft) {
    setDraft(next);
    setSubmitError(null);
    if (showValidation) {
      setValidationErrors(validateRecommendationDraft(next, records));
    }
    try {
      saveRecommendationDraft(next);
    } catch {
      // 输入过程中存储失败时不打断编辑，提交时再提示
    }
  }

  function clearDraft() {
    const empty = createEmptyRecommendationDraft();
    setDraft(empty);
    setShowValidation(false);
    setValidationErrors({});
    setSubmitError(null);
    clearRecommendationDraft();
  }

  async function submitRecommendation() {
    const errors = validateRecommendationDraft(draft, records);
    setShowValidation(true);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitState("editing");
      return;
    }
    if (!isRadarDomain(draft.domain) || draft.personalScore === null) {
      return;
    }

    setSubmitState("submitting");
    setSubmitError(null);

    const record: BookRecommendationRecord = {
      id: createRecommendationId(),
      title: draft.title.trim(),
      author: draft.author.trim(),
      domain: draft.domain,
      personalScore: draft.personalScore,
      reason: draft.reason.trim(),
      status: "recorded",
      submittedAt: new Date().toISOString(),
    };

    try {
      await delay(220);
      const saved = insertRecommendation({
        id: record.id,
        title: record.title,
        author: record.author,
        domain: record.domain,
        personalScore: record.personalScore,
        reason: record.reason,
        submittedAt: record.submittedAt,
      });
      clearRecommendationDraft();
      setRecords(getRecommendationRecords());
      setDraft(createEmptyRecommendationDraft());
      setLatestSubmittedId(saved.id);
      setShowValidation(false);
      setValidationErrors({});
      setSubmitState("success");
      setIsDrawerOpen(false);
      setIsRecordsModalOpen(true);
    } catch (error) {
      setSubmitState("error");
      const message = error instanceof Error ? error.message : "";
      if (message.includes("UNIQUE constraint failed")) {
        setSubmitError("你已经推荐过这本书，本次无需重复提交");
      } else {
        setSubmitError("推荐暂未写入虚拟表 book_recommendations，请稍后重试");
      }
    }
  }

  function closeRecordsModal() {
    setIsRecordsModalOpen(false);
    setSubmitState("idle");
  }

  function recommendAgain() {
    setIsRecordsModalOpen(false);
    openDrawer(true);
  }

  return {
    isDrawerOpen,
    isRecordsModalOpen,
    draft,
    records,
    latestSubmittedId,
    submitState,
    validationErrors: visibleErrors,
    submitError,
    canSubmit,
    openDrawer,
    closeDrawer,
    updateDraft,
    clearDraft,
    submitRecommendation,
    closeRecordsModal,
    recommendAgain,
  };
}

function createRecommendationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
