import { Router } from "express";
import { z } from "zod";
import { query } from "../db.js";

const router = Router();
const uuidParam = z.string().uuid();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, title, description, question_count FROM quizzes WHERE published = TRUE ORDER BY created_at DESC"
    );
    res.json({ quizzes: rows });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const parsedId = uuidParam.safeParse(req.params.id);
  if (!parsedId.success) return res.status(400).json({ error: "Invalid quiz ID" });
  try {
    const quizResult = await query(
      "SELECT id, title, description FROM quizzes WHERE id = $1 AND published = TRUE",
      [parsedId.data]
    );
    if (!quizResult.rows[0]) return res.status(404).json({ error: "Quiz not found" });

    const questionsResult = await query(
      `SELECT id, prompt, options, points, sort_order
       FROM quiz_questions WHERE quiz_id = $1 ORDER BY sort_order`,
      [parsedId.data]
    );
    res.json({ quiz: quizResult.rows[0], questions: questionsResult.rows });
  } catch (error) {
    next(error);
  }
});

const attemptSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    answerIndex: z.number().int().min(0).max(9)
  })).max(100)
});

router.post("/:id/attempts", async (req, res, next) => {
  const parsedId = uuidParam.safeParse(req.params.id);
  if (!parsedId.success) return res.status(400).json({ error: "Invalid quiz ID" });
  const parsed = attemptSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid answers", details: parsed.error.issues });

  try {
    const quiz = await query("SELECT id FROM quizzes WHERE id = $1 AND published = TRUE", [parsedId.data]);
    if (!quiz.rows[0]) return res.status(404).json({ error: "Quiz not found" });

    const questions = await query(
      "SELECT id, answer_index, points FROM quiz_questions WHERE quiz_id = $1",
      [parsedId.data]
    );
    const answerMap = new Map(parsed.data.answers.map((answer) => [answer.questionId, answer.answerIndex]));
    const validIds = new Set(questions.rows.map((question) => question.id));
    if ([...answerMap.keys()].some((id) => !validIds.has(id))) {
      return res.status(400).json({ error: "Answer includes a question that does not belong to this quiz" });
    }

    let score = 0;
    let maxScore = 0;
    for (const question of questions.rows) {
      maxScore += question.points;
      if (answerMap.get(question.id) === question.answer_index) score += question.points;
    }

    const result = await query(
      `INSERT INTO quiz_attempts (quiz_id, score, max_score, answers)
       VALUES ($1, $2, $3, $4::jsonb) RETURNING id, score, max_score, created_at`,
      [parsedId.data, score, maxScore, JSON.stringify(parsed.data.answers)]
    );
    res.status(201).json({ attempt: result.rows[0], percentage: maxScore ? Math.round(score / maxScore * 100) : 0 });
  } catch (error) {
    next(error);
  }
});

export default router;
